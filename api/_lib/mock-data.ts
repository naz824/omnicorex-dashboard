import { randomUUID } from 'node:crypto'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  business_name: string
  website_url: string
  industry: string
  location: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
  source: 'website' | 'referral' | 'google' | 'social_media' | 'cold_outreach' | 'other'
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
  status: 'discovery' | 'design' | 'development' | 'qa' | 'review' | 'launch' | 'support' | 'completed'
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes: string
  meeting_link: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  code_name: string
  role: string
  status: 'idle' | 'working' | 'waiting_approval' | 'error' | 'offline'
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
  category: 'email' | 'proposal' | 'deployment' | 'design' | 'financial' | 'scope_change'
  title: string
  description: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested'
  priority: 'p1' | 'p2' | 'p3' | 'p4'
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

let leads: Lead[] = [
  {
    id: '1', name: 'Maria Santos', email: 'maria@santosplumbing.com', phone: '(571) 555-0102',
    business_name: 'Santos Plumbing & HVAC', website_url: 'http://santosplumbing.com', industry: 'Plumbing/HVAC',
    location: 'Fairfax, VA', status: 'qualified', source: 'website', score: 82,
    budget_range: '$5,000 – $10,000', urgency: 'Within 30 days',
    notes: 'Current site is 8 years old, not mobile-friendly. Losing jobs to competitors with better online presence.',
    assigned_agent: 'Nova', next_follow_up: '2026-03-17T14:00:00Z', created_at: '2026-03-10T09:15:00Z', updated_at: '2026-03-14T16:30:00Z',
  },
  {
    id: '2', name: 'James Chen', email: 'james@chendentalcare.com', phone: '(703) 555-0198',
    business_name: 'Chen Dental Care', website_url: 'http://chendentalcare.com', industry: 'Dental',
    location: 'Arlington, VA', status: 'proposal_sent', source: 'google', score: 91,
    budget_range: '$10,000 – $25,000', urgency: 'Immediate',
    notes: 'Wants full rebrand + new patient booking system. Very motivated. Has budget approved.',
    assigned_agent: 'Nova', next_follow_up: '2026-03-16T10:00:00Z', created_at: '2026-03-08T11:00:00Z', updated_at: '2026-03-15T09:00:00Z',
  },
  {
    id: '3', name: 'Sarah Thompson', email: 'sarah@thompsonlaw.com', phone: '(571) 555-0234',
    business_name: 'Thompson & Associates Law', website_url: 'http://thompsonlaw.com', industry: 'Legal',
    location: 'Tysons, VA', status: 'new', source: 'referral', score: 68,
    budget_range: '$5,000 – $10,000', urgency: 'Within 60 days',
    notes: 'Referred by Chen Dental. Needs modern site with intake forms and case results showcase.',
    assigned_agent: 'Nova', next_follow_up: null, created_at: '2026-03-14T15:45:00Z', updated_at: '2026-03-14T15:45:00Z',
  },
  {
    id: '4', name: 'Mike Rodriguez', email: 'mike@rodriguezauto.com', phone: '(703) 555-0367',
    business_name: 'Rodriguez Auto Repair', website_url: '', industry: 'Automotive',
    location: 'Manassas, VA', status: 'contacted', source: 'cold_outreach', score: 55,
    budget_range: '$2,500 – $5,000', urgency: 'Exploring options',
    notes: 'No website at all. Running business from Facebook page. Needs education on ROI.',
    assigned_agent: 'Nova', next_follow_up: '2026-03-18T11:00:00Z', created_at: '2026-03-12T08:30:00Z', updated_at: '2026-03-13T14:20:00Z',
  },
  {
    id: '5', name: 'Lisa Park', email: 'lisa@parkfitness.com', phone: '(571) 555-0489',
    business_name: 'Park Fitness Studio', website_url: 'http://parkfitness.com', industry: 'Fitness',
    location: 'Reston, VA', status: 'negotiation', source: 'social_media', score: 76,
    budget_range: '$5,000 – $10,000', urgency: 'Within 30 days',
    notes: 'Wants class booking system and member portal. Comparing us with 2 other agencies.',
    assigned_agent: 'Nova', next_follow_up: '2026-03-16T15:00:00Z', created_at: '2026-03-06T10:00:00Z', updated_at: '2026-03-15T11:00:00Z',
  },
  {
    id: '6', name: 'David Kim', email: 'david@kimlandscaping.com', phone: '(703) 555-0512',
    business_name: 'Kim Landscaping', website_url: 'http://kimlandscaping.com', industry: 'Landscaping',
    location: 'Centreville, VA', status: 'won', source: 'website', score: 88,
    budget_range: '$5,000 – $10,000', urgency: 'Immediate',
    notes: 'Signed Growth package. Wants portfolio showcase and quote request form.',
    assigned_agent: 'Nova', next_follow_up: null, created_at: '2026-02-28T09:00:00Z', updated_at: '2026-03-12T16:00:00Z',
  },
]

let projects: Project[] = [
  {
    id: '1', lead_id: '6', name: 'Kim Landscaping Website Redesign', client_name: 'David Kim',
    client_email: 'david@kimlandscaping.com', status: 'design', package_tier: 'growth',
    budget: 7500, start_date: '2026-03-12', estimated_end_date: '2026-04-23',
    actual_end_date: null, progress: 25, current_phase: 'Design mockups in progress',
    notes: 'Client wants earthy tones. Portfolio gallery is key feature.', created_at: '2026-03-12T16:00:00Z', updated_at: '2026-03-15T10:00:00Z',
  },
  {
    id: '2', lead_id: '2', name: 'Chen Dental Care Full Rebrand', client_name: 'James Chen',
    client_email: 'james@chendentalcare.com', status: 'discovery', package_tier: 'premium',
    budget: 18000, start_date: '2026-03-15', estimated_end_date: '2026-05-15',
    actual_end_date: null, progress: 5, current_phase: 'Discovery call scheduled for Monday',
    notes: 'Full rebrand + booking system + patient portal. High-value client.', created_at: '2026-03-15T09:00:00Z', updated_at: '2026-03-15T09:00:00Z',
  },
]

let bookings: Booking[] = [
  { id: '1', lead_id: '3', name: 'Sarah Thompson', email: 'sarah@thompsonlaw.com', phone: '(571) 555-0234', business_name: 'Thompson & Associates Law', website_url: 'http://thompsonlaw.com', goal: 'Modern website with client intake forms', preferred_date: '2026-03-17', preferred_time: '10:00 AM', status: 'confirmed', notes: 'Referred by Chen Dental', meeting_link: 'https://meet.google.com/abc-defg-hij', created_at: '2026-03-14T15:45:00Z', updated_at: '2026-03-15T08:00:00Z' },
  { id: '2', lead_id: null, name: 'Roberto Vasquez', email: 'roberto@vasquezhvac.com', phone: '(703) 555-0623', business_name: 'Vasquez HVAC Services', website_url: '', goal: 'Need a website to get more customers', preferred_date: '2026-03-18', preferred_time: '2:00 PM', status: 'pending', notes: '', meeting_link: null, created_at: '2026-03-15T12:00:00Z', updated_at: '2026-03-15T12:00:00Z' },
  { id: '3', lead_id: '5', name: 'Lisa Park', email: 'lisa@parkfitness.com', phone: '(571) 555-0489', business_name: 'Park Fitness Studio', website_url: 'http://parkfitness.com', goal: 'Class booking system and member portal', preferred_date: '2026-03-20', preferred_time: '11:00 AM', status: 'confirmed', notes: 'Follow-up call to discuss revised proposal', meeting_link: 'https://meet.google.com/xyz-abcd-efg', created_at: '2026-03-15T11:00:00Z', updated_at: '2026-03-15T11:30:00Z' },
]

let agents: Agent[] = [
  { id: 'apex', name: 'Orchestrator', code_name: 'Apex', role: 'Lead Coordinator', status: 'working', avatar_color: 'from-white to-slate-300', avatar_initials: 'AO', current_task: 'Coordinating Kim Landscaping design phase', tasks_completed_today: 8, tasks_completed_total: 247, approvals_pending: 0, last_active: '2026-03-15T21:30:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash', 'Agent'] },
  { id: 'nova', name: 'Sales Agent', code_name: 'Nova', role: 'Senior Sales Strategist', status: 'waiting_approval', avatar_color: 'from-blue-400 to-blue-600', avatar_initials: 'NS', current_task: 'Drafting follow-up email for Park Fitness', tasks_completed_today: 5, tasks_completed_total: 189, approvals_pending: 2, last_active: '2026-03-15T21:15:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'] },
  { id: 'meridian', name: 'Marketing Agent', code_name: 'Meridian', role: 'Digital Marketing Strategist', status: 'working', avatar_color: 'from-emerald-400 to-emerald-600', avatar_initials: 'MK', current_task: 'Running SEO audit on Santos Plumbing competitor sites', tasks_completed_today: 3, tasks_completed_total: 156, approvals_pending: 0, last_active: '2026-03-15T21:20:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'] },
  { id: 'prism', name: 'Design Agent', code_name: 'Prism', role: 'Senior UX/UI Designer', status: 'working', avatar_color: 'from-purple-400 to-purple-600', avatar_initials: 'PD', current_task: 'Creating homepage mockup for Kim Landscaping', tasks_completed_today: 2, tasks_completed_total: 134, approvals_pending: 1, last_active: '2026-03-15T21:25:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'] },
  { id: 'vertex', name: 'Frontend Agent', code_name: 'Vertex', role: 'Senior Frontend Engineer', status: 'idle', avatar_color: 'from-cyan-400 to-cyan-600', avatar_initials: 'VF', current_task: null, tasks_completed_today: 0, tasks_completed_total: 98, approvals_pending: 0, last_active: '2026-03-15T18:00:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'] },
  { id: 'nexus', name: 'Backend Agent', code_name: 'Nexus', role: 'Senior Backend Engineer', status: 'idle', avatar_color: 'from-orange-400 to-orange-600', avatar_initials: 'NB', current_task: null, tasks_completed_today: 1, tasks_completed_total: 112, approvals_pending: 0, last_active: '2026-03-15T17:30:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'] },
  { id: 'sentinel', name: 'QA Agent', code_name: 'Sentinel', role: 'Senior QA Engineer', status: 'idle', avatar_color: 'from-rose-400 to-rose-600', avatar_initials: 'SQ', current_task: null, tasks_completed_today: 0, tasks_completed_total: 87, approvals_pending: 0, last_active: '2026-03-15T16:00:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash'] },
  { id: 'compass', name: 'Operations Agent', code_name: 'Compass', role: 'Senior Operations Manager', status: 'working', avatar_color: 'from-amber-400 to-amber-600', avatar_initials: 'CO', current_task: 'Preparing onboarding materials for Chen Dental', tasks_completed_today: 4, tasks_completed_total: 203, approvals_pending: 1, last_active: '2026-03-15T21:28:00Z', model: 'sonnet', tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash'] },
]

let approvals: Approval[] = [
  { id: '1', agent_id: 'nova', agent_name: 'Nova', category: 'email', title: 'Follow-up email to Park Fitness', description: 'Day 3 check-in email with case study for fitness studios', content: 'Subject: Quick thought for Park Fitness Studio\n\nHi Lisa,\n\nI was thinking about our conversation and wanted to share how we helped FitZone Studio increase their class bookings by 40% with a custom booking system.\n\nWould love to walk you through the specific features that made the biggest difference for them.\n\nBest,\nNasir Chase\nOmnicoreX', status: 'pending', priority: 'p2', submitted_at: '2026-03-15T21:15:00Z', reviewed_at: null, reviewer_notes: '', metadata: { lead_id: '5', email_type: 'follow_up', sequence_day: 3 } },
  { id: '2', agent_id: 'nova', agent_name: 'Nova', category: 'proposal', title: 'Growth Package Proposal — Santos Plumbing', description: 'Customized proposal for Santos Plumbing & HVAC based on discovery call', content: '# Website Proposal: Santos Plumbing & HVAC\n\n## Recommended: Growth Package ($7,500)\n\n### What You Get:\n- Custom 8-page responsive website\n- Mobile-first design\n- Service area pages (Fairfax, Arlington, Alexandria)\n- Online appointment booking\n- Google Business Profile optimization\n- 90-day SEO foundation\n- 30-day money-back guarantee\n\n### Timeline: 6 weeks\n### Payment: 50% upfront, 50% on launch', status: 'pending', priority: 'p1', submitted_at: '2026-03-15T20:00:00Z', reviewed_at: null, reviewer_notes: '', metadata: { lead_id: '1', package_tier: 'growth', amount: 7500 } },
  { id: '3', agent_id: 'prism', agent_name: 'Prism', category: 'design', title: 'Kim Landscaping Homepage Wireframe', description: 'Low-fidelity wireframe for client review', content: 'Wireframe includes: Hero with portfolio slideshow, services grid, testimonials carousel, contact CTA, footer.', status: 'approved', priority: 'p2', submitted_at: '2026-03-14T15:00:00Z', reviewed_at: '2026-03-14T16:30:00Z', reviewer_notes: 'Looks great. Add a seasonal specials section.', metadata: { project_id: '1', phase: 'design' } },
  { id: '4', agent_id: 'compass', agent_name: 'Compass', category: 'email', title: 'Welcome email to Chen Dental Care', description: 'Client onboarding welcome email with next steps', content: 'Subject: Welcome to OmnicoreX — Here\'s What Happens Next\n\nDr. Chen,\n\nWelcome aboard! We\'re excited to transform Chen Dental Care\'s online presence.\n\nHere\'s your roadmap:\n1. Discovery call (Monday, March 16 at 10 AM)\n2. Brand asset collection (we\'ll send a questionnaire)\n3. Design phase begins (Week of March 23)\n\nQuestions? Reply to this email anytime.\n\nBest,\nNasir Chase\nOmnicoreX', status: 'pending', priority: 'p1', submitted_at: '2026-03-15T21:28:00Z', reviewed_at: null, reviewer_notes: '', metadata: { project_id: '2', email_type: 'onboarding' } },
]

let activities: Activity[] = [
  { id: '1', agent_name: 'Nova', action: 'Scored new lead', description: 'Sarah Thompson — Thompson & Associates Law — Score: 68/100', entity_type: 'lead', entity_id: '3', timestamp: '2026-03-15T21:30:00Z' },
  { id: '2', agent_name: 'Compass', action: 'Submitted for approval', description: 'Welcome email for Chen Dental Care onboarding', entity_type: 'approval', entity_id: '4', timestamp: '2026-03-15T21:28:00Z' },
  { id: '3', agent_name: 'Prism', action: 'Started task', description: 'Creating homepage mockup for Kim Landscaping', entity_type: 'project', entity_id: '1', timestamp: '2026-03-15T21:25:00Z' },
  { id: '4', agent_name: 'Meridian', action: 'Completed SEO audit', description: 'Competitor analysis for Santos Plumbing — found 3 keyword gaps', entity_type: 'lead', entity_id: '1', timestamp: '2026-03-15T21:20:00Z' },
  { id: '5', agent_name: 'Nova', action: 'Submitted for approval', description: 'Follow-up email for Park Fitness Studio', entity_type: 'approval', entity_id: '1', timestamp: '2026-03-15T21:15:00Z' },
  { id: '6', agent_name: 'Apex', action: 'Assigned task', description: 'Assigned homepage mockup to Prism for Kim Landscaping project', entity_type: 'project', entity_id: '1', timestamp: '2026-03-15T20:30:00Z' },
  { id: '7', agent_name: 'Nova', action: 'Submitted for approval', description: 'Growth Package proposal for Santos Plumbing ($7,500)', entity_type: 'approval', entity_id: '2', timestamp: '2026-03-15T20:00:00Z' },
  { id: '8', agent_name: 'Nexus', action: 'Updated schema', description: 'Added booking_status enum to Supabase migration', entity_type: 'system', entity_id: null, timestamp: '2026-03-15T17:30:00Z' },
]

const mockRevenue: RevenueMetric[] = [
  { month: 'Oct', revenue: 0, deals_closed: 0, avg_deal_size: 0, pipeline_value: 5000 },
  { month: 'Nov', revenue: 2500, deals_closed: 1, avg_deal_size: 2500, pipeline_value: 12000 },
  { month: 'Dec', revenue: 5000, deals_closed: 1, avg_deal_size: 5000, pipeline_value: 18000 },
  { month: 'Jan', revenue: 7500, deals_closed: 2, avg_deal_size: 3750, pipeline_value: 25000 },
  { month: 'Feb', revenue: 12500, deals_closed: 2, avg_deal_size: 6250, pipeline_value: 35000 },
  { month: 'Mar', revenue: 7500, deals_closed: 1, avg_deal_size: 7500, pipeline_value: 48500 },
]

// Leads
export function getLeads(): Lead[] {
  return leads
}

export function getLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id)
}

export function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
  const now = new Date().toISOString()
  const newLead: Lead = {
    ...lead,
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  }
  leads.push(newLead)
  return newLead
}

export function updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'created_at'>>): Lead | undefined {
  const lead = leads.find((l) => l.id === id)
  if (!lead) return undefined
  const updated: Lead = {
    ...lead,
    ...updates,
    updated_at: new Date().toISOString(),
  }
  const idx = leads.indexOf(lead)
  leads[idx] = updated
  return updated
}

export function deleteLead(id: string): boolean {
  const idx = leads.findIndex((l) => l.id === id)
  if (idx === -1) return false
  leads.splice(idx, 1)
  return true
}

// Projects
export function getProjects(): Project[] {
  return projects
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
  const now = new Date().toISOString()
  const newProject: Project = {
    ...project,
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  }
  projects.push(newProject)
  return newProject
}

export function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Project | undefined {
  const project = projects.find((p) => p.id === id)
  if (!project) return undefined
  const updated: Project = {
    ...project,
    ...updates,
    updated_at: new Date().toISOString(),
  }
  const idx = projects.indexOf(project)
  projects[idx] = updated
  return updated
}

export function deleteProject(id: string): boolean {
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return false
  projects.splice(idx, 1)
  return true
}

// Bookings
export function getBookings(): Booking[] {
  return bookings
}

export function getBooking(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id)
}

export function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Booking {
  const now = new Date().toISOString()
  const newBooking: Booking = {
    ...booking,
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  }
  bookings.push(newBooking)
  return newBooking
}

export function updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'created_at'>>): Booking | undefined {
  const booking = bookings.find((b) => b.id === id)
  if (!booking) return undefined
  const updated: Booking = {
    ...booking,
    ...updates,
    updated_at: new Date().toISOString(),
  }
  const idx = bookings.indexOf(booking)
  bookings[idx] = updated
  return updated
}

export function deleteBooking(id: string): boolean {
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return false
  bookings.splice(idx, 1)
  return true
}

// Agents
export function getAgents(): Agent[] {
  return agents
}

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export function updateAgent(id: string, updates: Partial<Omit<Agent, 'id'>>): Agent | undefined {
  const agent = agents.find((a) => a.id === id)
  if (!agent) return undefined
  const updated: Agent = {
    ...agent,
    ...updates,
  }
  const idx = agents.indexOf(agent)
  agents[idx] = updated
  return updated
}

// Approvals
export function getApprovals(): Approval[] {
  return approvals
}

export function getApproval(id: string): Approval | undefined {
  return approvals.find((a) => a.id === id)
}

export function createApproval(approval: Omit<Approval, 'id' | 'submitted_at'>): Approval {
  const newApproval: Approval = {
    ...approval,
    id: randomUUID(),
    submitted_at: new Date().toISOString(),
  }
  approvals.push(newApproval)
  return newApproval
}

export function updateApproval(
  id: string,
  updates: Partial<Omit<Approval, 'id' | 'submitted_at'>>
): Approval | undefined {
  const approval = approvals.find((a) => a.id === id)
  if (!approval) return undefined
  const updated: Approval = {
    ...approval,
    ...updates,
  }
  const idx = approvals.indexOf(approval)
  approvals[idx] = updated
  return updated
}

// Activities
export function getActivities(limit = 50): Activity[] {
  return activities.slice(0, limit)
}

export function createActivity(activity: Omit<Activity, 'id'>): Activity {
  const newActivity: Activity = {
    ...activity,
    id: randomUUID(),
  }
  activities.unshift(newActivity)
  return newActivity
}

// Revenue
export function getRevenue(): RevenueMetric[] {
  return mockRevenue
}

// Stats
export function getDashboardStats() {
  const qualifiedLeads = leads.filter((l) => ['qualified', 'proposal_sent', 'negotiation', 'won'].includes(l.status))
  const activeProjects = projects.filter((p) => !['completed', 'support'].includes(p.status))
  const pendingApprovals = approvals.filter((a) => a.status === 'pending')
  const activeAgents = agents.filter((a) => a.status === 'working')

  return {
    total_leads: leads.length,
    qualified_leads: qualifiedLeads.length,
    active_projects: activeProjects.length,
    pending_approvals: pendingApprovals.length,
    monthly_revenue: 7500,
    conversion_rate: 16.7,
    avg_response_time: '1.2h',
    upcoming_bookings: bookings.filter((b) => b.status === 'confirmed').length,
    agents_active: activeAgents.length,
    tasks_completed_today: 23,
  }
}
