-- ============================================================================
-- OmnicoreX Dashboard — Realtime Configuration
-- Version: 004
-- Description: Enable Supabase Realtime on key tables for live updates
-- ============================================================================

-- Enable Realtime publication for leads
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- Enable Realtime publication for projects
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Enable Realtime publication for project_tasks
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;

-- Enable Realtime publication for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Enable Realtime publication for approvals
ALTER PUBLICATION supabase_realtime ADD TABLE approvals;

-- Enable Realtime publication for activities
ALTER PUBLICATION supabase_realtime ADD TABLE activities;

-- Enable Realtime publication for agents
ALTER PUBLICATION supabase_realtime ADD TABLE agents;

-- Enable Realtime publication for revenue_metrics
ALTER PUBLICATION supabase_realtime ADD TABLE revenue_metrics;
