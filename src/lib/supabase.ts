import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Lead, Project, ProjectTask, Booking, AgentConfig, Approval, Activity, RevenueMetric, DashboardStats } from '@/types'
import { mockLeads, mockProjects, mockTasks, mockBookings, mockAgents, mockApprovals, mockActivities, mockRevenue, mockStats } from '@/data/mock'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Graceful degradation when Supabase is not configured
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// ============================================================================
// Export Supabase Client for Direct Use
// ============================================================================

export function getSupabaseClient(): SupabaseClient | null {
  return supabase
}

// ============================================================================
// Server-side Admin Functions Placeholder
// ============================================================================

export function getSupabaseAdmin(): SupabaseClient | null {
  // This is a placeholder for server-side operations with admin privileges
  // In a real application, this would use a service role key from the server
  // and would not be exposed to the client
  console.warn(
    'getSupabaseAdmin() is a placeholder. Implement with service_role key on the server.'
  )
  return null
}

// ============================================================================
// Real-time Channel Helpers
// ============================================================================

export function createRealtimeChannel(name: string) {
  if (!supabase) return null
  return supabase.channel(name)
}

// ============================================================================
// Data Access Layer — falls back to mock data when Supabase isn't configured
// ============================================================================

export async function fetchLeads(): Promise<Lead[]> {
  if (!supabase) return mockLeads
  const { data, error } = await supabase.from('leads').select('*').is('deleted_at', null).order('created_at', { ascending: false })
  if (error) { console.error('fetchLeads error:', error); return mockLeads }
  return data as Lead[]
}

export async function fetchProjects(): Promise<Project[]> {
  if (!supabase) return mockProjects
  const { data, error } = await supabase.from('projects').select('*').is('deleted_at', null).order('created_at', { ascending: false })
  if (error) { console.error('fetchProjects error:', error); return mockProjects }
  return data as Project[]
}

export async function fetchTasks(projectId?: string): Promise<ProjectTask[]> {
  if (!supabase) return projectId ? mockTasks.filter(t => t.project_id === projectId) : mockTasks
  let query = supabase.from('project_tasks').select('*').order('created_at', { ascending: false })
  if (projectId) query = query.eq('project_id', projectId)
  const { data, error } = await query
  if (error) { console.error('fetchTasks error:', error); return mockTasks }
  return data as ProjectTask[]
}

export async function fetchBookings(): Promise<Booking[]> {
  if (!supabase) return mockBookings
  const { data, error } = await supabase.from('bookings').select('*').order('preferred_date', { ascending: true })
  if (error) { console.error('fetchBookings error:', error); return mockBookings }
  return data as Booking[]
}

export async function fetchAgents(): Promise<AgentConfig[]> {
  if (!supabase) return mockAgents
  const { data, error } = await supabase.from('agents').select('*').order('name')
  if (error) { console.error('fetchAgents error:', error); return mockAgents }
  return data as AgentConfig[]
}

export async function fetchApprovals(): Promise<Approval[]> {
  if (!supabase) return mockApprovals
  const { data, error } = await supabase.from('approvals').select('*').order('submitted_at', { ascending: false })
  if (error) { console.error('fetchApprovals error:', error); return mockApprovals }
  return data as Approval[]
}

export async function fetchActivities(): Promise<Activity[]> {
  if (!supabase) return mockActivities
  const { data, error } = await supabase.from('activities').select('*').order('timestamp', { ascending: false }).limit(50)
  if (error) { console.error('fetchActivities error:', error); return mockActivities }
  return data as Activity[]
}

export async function fetchRevenue(): Promise<RevenueMetric[]> {
  if (!supabase) return mockRevenue
  const { data, error } = await supabase.from('revenue_metrics').select('*').order('month', { ascending: true })
  if (error) { console.error('fetchRevenue error:', error); return mockRevenue }
  return data as RevenueMetric[]
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (!supabase) return mockStats
  const { data, error } = await supabase.from('dashboard_stats').select('*').single()
  if (error) { console.error('fetchDashboardStats error:', error); return mockStats }
  return { ...mockStats, ...data } as DashboardStats
}

// ============================================================================
// Mutations — only work when Supabase is configured
// ============================================================================

export async function updateApprovalStatus(
  id: string,
  status: 'approved' | 'rejected' | 'revision_requested',
  reviewerNotes: string = ''
): Promise<boolean> {
  if (!supabase) return true // Mock mode: pretend success
  const { error } = await supabase.from('approvals').update({
    status,
    reviewed_at: new Date().toISOString(),
    reviewer_notes: reviewerNotes,
  }).eq('id', id)
  if (error) { console.error('updateApprovalStatus error:', error); return false }
  return true
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  if (!supabase) return true
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  if (error) { console.error('updateLeadStatus error:', error); return false }
  return true
}

export async function updateBookingStatus(id: string, status: string): Promise<boolean> {
  if (!supabase) return true
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
  if (error) { console.error('updateBookingStatus error:', error); return false }
  return true
}
