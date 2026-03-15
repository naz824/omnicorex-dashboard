// ============================================================================
// OmnicoreX Dashboard — Configuration Constants
// ============================================================================

export const APP_NAME = 'OmnicoreX'
export const APP_DESCRIPTION = 'Command Center'

export const LEAD_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  contacted: { label: 'Contacted', color: 'text-sky-400', bg: 'bg-sky-400/10' },
  qualified: { label: 'Qualified', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  proposal_sent: { label: 'Proposal Sent', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  negotiation: { label: 'Negotiation', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  won: { label: 'Won', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  lost: { label: 'Lost', color: 'text-rose-400', bg: 'bg-rose-400/10' },
}

export const PROJECT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  discovery: { label: 'Discovery', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  design: { label: 'Design', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  development: { label: 'Development', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  qa: { label: 'QA', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  review: { label: 'Client Review', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  launch: { label: 'Launch', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  support: { label: 'Post-Launch', color: 'text-teal-400', bg: 'bg-teal-400/10' },
  completed: { label: 'Completed', color: 'text-slate-400', bg: 'bg-slate-400/10' },
}

export const BOOKING_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400' },
  confirmed: { label: 'Confirmed', color: 'text-emerald-400' },
  completed: { label: 'Completed', color: 'text-slate-400' },
  cancelled: { label: 'Cancelled', color: 'text-rose-400' },
  no_show: { label: 'No Show', color: 'text-red-400' },
}

export const AGENT_STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  idle: { label: 'Idle', color: 'text-slate-400', dot: 'bg-slate-400' },
  working: { label: 'Working', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  waiting_approval: { label: 'Awaiting Approval', color: 'text-amber-400', dot: 'bg-amber-400' },
  error: { label: 'Error', color: 'text-rose-400', dot: 'bg-rose-400' },
  offline: { label: 'Offline', color: 'text-slate-600', dot: 'bg-slate-600' },
}

export const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  p1: { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  p2: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  p3: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  p4: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400/10' },
}

export const APPROVAL_CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = {
  email: { label: 'Email', icon: 'Mail' },
  proposal: { label: 'Proposal', icon: 'FileText' },
  deployment: { label: 'Deployment', icon: 'Rocket' },
  design: { label: 'Design', icon: 'Palette' },
  financial: { label: 'Financial', icon: 'DollarSign' },
  scope_change: { label: 'Scope Change', icon: 'GitBranch' },
}

export const PACKAGE_TIERS = {
  starter: { label: 'Starter', range: '$2,500 – $5,000' },
  growth: { label: 'Growth', range: '$5,000 – $10,000' },
  premium: { label: 'Premium', range: '$10,000 – $25,000' },
  custom: { label: 'Custom', range: '$25,000+' },
}

export const NAV_ITEMS = [
  { title: 'Overview', href: '/', icon: 'LayoutDashboard' },
  { title: 'Leads', href: '/leads', icon: 'Users' },
  { title: 'Bookings', href: '/bookings', icon: 'Calendar' },
  { title: 'Projects', href: '/projects', icon: 'FolderKanban' },
  { title: 'Agents', href: '/agents', icon: 'Bot' },
  { title: 'Approvals', href: '/approvals', icon: 'ShieldCheck' },
  { title: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
]
