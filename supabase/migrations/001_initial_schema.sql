-- ============================================================================
-- OmnicoreX Dashboard — Supabase Schema Migration
-- Version: 001
-- Description: Initial schema for leads, projects, tasks, bookings,
--              agents, approvals, activities, and revenue tracking
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'
);

CREATE TYPE lead_source AS ENUM (
  'website', 'referral', 'google', 'social_media', 'cold_outreach', 'other'
);

CREATE TYPE project_status AS ENUM (
  'discovery', 'design', 'development', 'qa', 'review', 'launch', 'support', 'completed'
);

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
);

CREATE TYPE agent_status AS ENUM (
  'idle', 'working', 'waiting_approval', 'error', 'offline'
);

CREATE TYPE approval_status AS ENUM (
  'pending', 'approved', 'rejected', 'revision_requested'
);

CREATE TYPE approval_category AS ENUM (
  'email', 'proposal', 'deployment', 'design', 'financial', 'scope_change'
);

CREATE TYPE task_priority AS ENUM ('p1', 'p2', 'p3', 'p4');

CREATE TYPE task_status AS ENUM ('backlog', 'in_progress', 'review', 'done');

CREATE TYPE package_tier AS ENUM ('starter', 'growth', 'premium', 'custom');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  business_name TEXT NOT NULL,
  website_url TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  location TEXT DEFAULT '',
  status lead_status NOT NULL DEFAULT 'new',
  source lead_source NOT NULL DEFAULT 'website',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  budget_range TEXT DEFAULT '',
  urgency TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  assigned_agent TEXT DEFAULT 'Nova',
  next_follow_up TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'discovery',
  package package_tier NOT NULL DEFAULT 'starter',
  budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_end_date DATE NOT NULL,
  actual_end_date DATE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_phase TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Project Tasks (Kanban)
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status task_status NOT NULL DEFAULT 'backlog',
  priority task_priority NOT NULL DEFAULT 'p3',
  assigned_agent TEXT DEFAULT '',
  estimated_hours NUMERIC(5,1) DEFAULT 0,
  actual_hours NUMERIC(5,1) DEFAULT 0,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings (Discovery Calls)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  business_name TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  goal TEXT DEFAULT '',
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  meeting_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent Configurations
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code_name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  status agent_status NOT NULL DEFAULT 'idle',
  avatar_color TEXT DEFAULT '',
  avatar_initials TEXT DEFAULT '',
  current_task TEXT,
  tasks_completed_today INTEGER DEFAULT 0,
  tasks_completed_total INTEGER DEFAULT 0,
  approvals_pending INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  model TEXT DEFAULT 'sonnet',
  tools TEXT[] DEFAULT '{}',
  config_path TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approvals (Human-in-the-Loop)
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  category approval_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  priority task_priority NOT NULL DEFAULT 'p3',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Activity Log
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT DEFAULT '',
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Revenue Metrics (Monthly Snapshots)
CREATE TABLE revenue_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month DATE NOT NULL UNIQUE,
  revenue NUMERIC(10,2) DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  avg_deal_size NUMERIC(10,2) DEFAULT 0,
  pipeline_value NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_assigned_agent ON leads(assigned_agent);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_lead_id ON projects(lead_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_tasks_project_id ON project_tasks(project_id);
CREATE INDEX idx_tasks_status ON project_tasks(status);
CREATE INDEX idx_tasks_assigned_agent ON project_tasks(assigned_agent);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX idx_bookings_lead_id ON bookings(lead_id);

CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_agent_id ON approvals(agent_id);
CREATE INDEX idx_approvals_submitted_at ON approvals(submitted_at DESC);

CREATE INDEX idx_activities_agent_name ON activities(agent_name);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX idx_activities_entity_type ON activities(entity_type);

-- ============================================================================
-- TRIGGERS (auto-update updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_revenue_updated_at
  BEFORE UPDATE ON revenue_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_metrics ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/write all data (single-tenant for now)
CREATE POLICY "Authenticated users full access to leads"
  ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to projects"
  ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to tasks"
  ON project_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to bookings"
  ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to agents"
  ON agents FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to approvals"
  ON approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to activities"
  ON activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access to revenue"
  ON revenue_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anon can insert bookings (from public website form)
CREATE POLICY "Anon can create bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (true);

-- Anon can insert leads (from public website score tool)
CREATE POLICY "Anon can create leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM leads WHERE deleted_at IS NULL) AS total_leads,
  (SELECT COUNT(*) FROM leads WHERE status IN ('qualified', 'proposal_sent', 'negotiation') AND deleted_at IS NULL) AS qualified_leads,
  (SELECT COUNT(*) FROM projects WHERE status NOT IN ('completed') AND deleted_at IS NULL) AS active_projects,
  (SELECT COUNT(*) FROM approvals WHERE status = 'pending') AS pending_approvals,
  (SELECT COALESCE(SUM(revenue), 0) FROM revenue_metrics WHERE month >= DATE_TRUNC('month', CURRENT_DATE)) AS monthly_revenue,
  (SELECT COUNT(*) FROM bookings WHERE preferred_date >= CURRENT_DATE AND status IN ('pending', 'confirmed')) AS upcoming_bookings,
  (SELECT COUNT(*) FROM agents WHERE status IN ('working', 'waiting_approval')) AS agents_active,
  (SELECT COALESCE(SUM(tasks_completed_today), 0) FROM agents) AS tasks_completed_today;
