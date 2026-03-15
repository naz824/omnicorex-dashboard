// ============================================================================
// OmnicoreX Dashboard — Type Definitions
// ============================================================================

// --- Enums ---

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'website' | 'referral' | 'google' | 'social_media' | 'cold_outreach' | 'other'
export type ProjectStatus = 'discovery' | 'design' | 'development' | 'qa' | 'review' | 'launch' | 'support' | 'completed'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type AgentStatus = 'idle' | 'working' | 'waiting_approval' | 'error' | 'offline'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested'
export type ApprovalCategory = 'email' | 'proposal' | 'deployment' | 'design' | 'financial' | 'scope_change'
export type Priority = 'p1' | 'p2' | 'p3' | 'p4'
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'

// --- Core Entities ---

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  business_name: string
  website_url: string
  industry: string
  location: string
  status: LeadStatus
  source: LeadSource
  score: number
  budget_range: string
  urgency: string
  notes: string
  assigned_agent: string
  next_follow_up: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  lead_id: string
  name: string
  client_name: string
  client_email: string
  status: ProjectStatus
  package_tier: 'starter' | 'growth' | 'premium' | 'custom'
  budget: number
  start_date: string
  estimated_end_date: string
  actual_end_date: string | null
  progress: number
  current_phase: string
  notes: string
  created_at: string
  updated_at: string
}

export interface ProjectTask {
  id: string
  project_id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigned_agent: string
  estimated_hours: number
  actual_hours: number
  due_date: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  lead_id: string | null
  name: string
  email: string
  phone: string
  business_name: string
  website_url: string
  goal: string
  preferred_date: string
  preferred_time: string
  status: BookingStatus
  notes: string
  meeting_link: string | null
  created_at: string
  updated_at: string
}

export interface AgentConfig {
  id: string
  name: string
  code_name: string
  role: string
  status: AgentStatus
  avatar_color: string
  avatar_initials: string
  current_task: string | null
  tasks_completed_today: number
  tasks_completed_total: number
  approvals_pending: number
  last_active: string
  model: string
  tools: string[]
}

export interface Approval {
  id: string
  agent_id: string
  agent_name: string
  category: ApprovalCategory
  title: string
  description: string
  content: string
  status: ApprovalStatus
  priority: Priority
  submitted_at: string
  reviewed_at: string | null
  reviewer_notes: string
  metadata: Record<string, unknown>
}

export interface Activity {
  id: string
  agent_name: string
  action: string
  description: string
  entity_type: 'lead' | 'project' | 'booking' | 'approval' | 'system'
  entity_id: string | null
  timestamp: string
}

export interface RevenueMetric {
  month: string
  revenue: number
  deals_closed: number
  avg_deal_size: number
  pipeline_value: number
}

export interface DashboardStats {
  total_leads: number
  qualified_leads: number
  active_projects: number
  pending_approvals: number
  monthly_revenue: number
  conversion_rate: number
  avg_response_time: string
  upcoming_bookings: number
  agents_active: number
  tasks_completed_today: number
}

// --- Component Props ---

export interface SidebarNavItem {
  title: string
  href: string
  icon: string
  badge?: number
}

export interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: string
}

export interface PipelineColumn {
  id: LeadStatus
  title: string
  leads: Lead[]
}
