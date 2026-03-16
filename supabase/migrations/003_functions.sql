-- ============================================================================
-- OmnicoreX Dashboard — PostgreSQL Functions
-- Version: 003
-- Description: Business logic functions for dashboard operations
-- ============================================================================

-- ============================================================================
-- FUNCTION: get_dashboard_stats()
-- Returns all key performance indicator metrics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(
  total_leads BIGINT,
  qualified_leads BIGINT,
  active_projects BIGINT,
  pending_approvals BIGINT,
  monthly_revenue NUMERIC,
  upcoming_bookings BIGINT,
  agents_active BIGINT,
  tasks_completed_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM leads WHERE deleted_at IS NULL),
    (SELECT COUNT(*) FROM leads WHERE status IN ('qualified', 'proposal_sent', 'negotiation') AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM projects WHERE status NOT IN ('completed') AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM approvals WHERE status = 'pending'),
    (SELECT COALESCE(SUM(revenue), 0) FROM revenue_metrics WHERE month >= DATE_TRUNC('month', CURRENT_DATE)),
    (SELECT COUNT(*) FROM bookings WHERE preferred_date >= CURRENT_DATE AND status IN ('pending', 'confirmed')),
    (SELECT COUNT(*) FROM agents WHERE status IN ('working', 'waiting_approval')),
    (SELECT COALESCE(SUM(tasks_completed_today), 0) FROM agents);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FUNCTION: get_pipeline_summary()
-- Returns count of leads per status for pipeline view
-- ============================================================================
CREATE OR REPLACE FUNCTION get_pipeline_summary()
RETURNS TABLE(
  status TEXT,
  lead_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.status::TEXT,
    COUNT(l.id)
  FROM leads l
  WHERE l.deleted_at IS NULL
  GROUP BY l.status
  ORDER BY
    CASE l.status
      WHEN 'new' THEN 1
      WHEN 'contacted' THEN 2
      WHEN 'qualified' THEN 3
      WHEN 'proposal_sent' THEN 4
      WHEN 'negotiation' THEN 5
      WHEN 'won' THEN 6
      WHEN 'lost' THEN 7
    END;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FUNCTION: get_revenue_summary(months int)
-- Returns monthly revenue data for the last N months
-- ============================================================================
CREATE OR REPLACE FUNCTION get_revenue_summary(months INT DEFAULT 6)
RETURNS TABLE(
  month TEXT,
  revenue NUMERIC,
  deals_closed INTEGER,
  avg_deal_size NUMERIC,
  pipeline_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(rm.month, 'Mon'),
    rm.revenue,
    rm.deals_closed,
    rm.avg_deal_size,
    rm.pipeline_value
  FROM revenue_metrics rm
  WHERE rm.month >= (CURRENT_DATE - INTERVAL '1 month' * months)
  ORDER BY rm.month DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- FUNCTION: update_lead_score(lead_id uuid, new_score int)
-- Updates a lead's score with validation (0-100)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_lead_score(
  lead_id UUID,
  new_score INT
) RETURNS TABLE(
  id UUID,
  name TEXT,
  score INT,
  status TEXT,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  validated_score INT;
BEGIN
  -- Validate score is between 0 and 100
  validated_score := GREATEST(0, LEAST(100, new_score));

  UPDATE leads
  SET score = validated_score, updated_at = NOW()
  WHERE id = lead_id AND deleted_at IS NULL
  RETURNING leads.id, leads.name, leads.score, leads.status::TEXT, leads.updated_at
  INTO id, name, score, status, updated_at;

  IF id IS NULL THEN
    RAISE EXCEPTION 'Lead not found or has been deleted';
  END IF;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: approve_item(approval_id uuid, reviewer_notes text)
-- Marks an approval as approved with optional reviewer notes
-- ============================================================================
CREATE OR REPLACE FUNCTION approve_item(
  approval_id UUID,
  reviewer_notes TEXT DEFAULT ''
) RETURNS TABLE(
  id UUID,
  agent_name TEXT,
  title TEXT,
  status TEXT,
  reviewed_at TIMESTAMPTZ
) AS $$
BEGIN
  UPDATE approvals
  SET
    status = 'approved'::approval_status,
    reviewed_at = NOW(),
    reviewer_notes = reviewer_notes
  WHERE id = approval_id
  RETURNING approvals.id, approvals.agent_name, approvals.title, approvals.status::TEXT, approvals.reviewed_at
  INTO id, agent_name, title, status, reviewed_at;

  IF id IS NULL THEN
    RAISE EXCEPTION 'Approval not found';
  END IF;

  -- Log the activity
  INSERT INTO activities (agent_name, action, description, entity_type, entity_id, timestamp)
  VALUES ('System', 'Approved item', title, 'approval', approval_id, NOW());

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: reject_item(approval_id uuid, reviewer_notes text)
-- Marks an approval as rejected with reviewer notes
-- ============================================================================
CREATE OR REPLACE FUNCTION reject_item(
  approval_id UUID,
  reviewer_notes TEXT DEFAULT ''
) RETURNS TABLE(
  id UUID,
  agent_name TEXT,
  title TEXT,
  status TEXT,
  reviewed_at TIMESTAMPTZ
) AS $$
BEGIN
  UPDATE approvals
  SET
    status = 'rejected'::approval_status,
    reviewed_at = NOW(),
    reviewer_notes = reviewer_notes
  WHERE id = approval_id
  RETURNING approvals.id, approvals.agent_name, approvals.title, approvals.status::TEXT, approvals.reviewed_at
  INTO id, agent_name, title, status, reviewed_at;

  IF id IS NULL THEN
    RAISE EXCEPTION 'Approval not found';
  END IF;

  -- Log the activity
  INSERT INTO activities (agent_name, action, description, entity_type, entity_id, timestamp)
  VALUES ('System', 'Rejected item', title, 'approval', approval_id, NOW());

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: log_activity(agent_id text, action text, entity_type text, entity_id uuid, details text)
-- Creates a new activity log entry
-- ============================================================================
CREATE OR REPLACE FUNCTION log_activity(
  agent_id TEXT,
  action TEXT,
  entity_type TEXT,
  entity_id UUID DEFAULT NULL,
  details TEXT DEFAULT ''
) RETURNS TABLE(
  id UUID,
  agent_name TEXT,
  action_text TEXT,
  timestamp TIMESTAMPTZ
) AS $$
DECLARE
  agent_name_val TEXT;
BEGIN
  -- Get agent name from agent_id
  SELECT agents.name INTO agent_name_val
  FROM agents
  WHERE agents.id = agent_id;

  IF agent_name_val IS NULL THEN
    agent_name_val := 'Unknown Agent';
  END IF;

  -- Insert activity log entry
  INSERT INTO activities (agent_name, action, description, entity_type, entity_id, timestamp)
  VALUES (agent_name_val, action, details, entity_type, entity_id, NOW())
  RETURNING activities.id, activities.agent_name, activities.action, activities.timestamp
  INTO id, agent_name, action_text, timestamp;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Grant permissions on functions to authenticated users
-- ============================================================================
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_pipeline_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_summary(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_lead_score(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_item(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_item(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION log_activity(TEXT, TEXT, TEXT, UUID, TEXT) TO authenticated;
