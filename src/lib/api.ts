import { supabase, isSupabaseConfigured } from './supabase'
import type {
  Lead,
  Project,
  ProjectTask,
  Booking,
  AgentConfig,
  Approval,
  Activity,
  RevenueMetric,
  DashboardStats,
} from '@/types'
import {
  mockLeads,
  mockProjects,
  mockTasks,
  mockBookings,
  mockAgents,
  mockApprovals,
  mockActivities,
  mockRevenue,
  mockStats,
} from '@/data/mock'

// ============================================================================
// API Error Types
// ============================================================================

export class APIError extends Error {
  code: string
  statusCode: number

  constructor(code: string, message: string, statusCode: number = 500) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.statusCode = statusCode
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super('NOT_FOUND', message, 404)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400)
    this.name = 'ValidationError'
  }
}

// ============================================================================
// Leads API
// ============================================================================

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) return mockLeads
  try {
    const { data, error } = await supabase!.from('leads')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch leads: ${error.message}`)
    return data as Lead[]
  } catch (err) {
    console.error('getLeads error:', err)
    return mockLeads
  }
}

export async function getLeadById(id: string): Promise<Lead> {
  if (!isSupabaseConfigured()) {
    const lead = mockLeads.find(l => l.id === id)
    if (!lead) throw new NotFoundError(`Lead with id ${id} not found`)
    return lead
  }
  try {
    const { data, error } = await supabase!.from('leads').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch lead: ${error.message}`)
    if (!data) throw new NotFoundError(`Lead with id ${id} not found`)
    return data as Lead
  } catch (err) {
    console.error('getLeadById error:', err)
    throw err
  }
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  if (!isSupabaseConfigured()) {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newLead
  }
  try {
    const { data, error } = await supabase!.from('leads').insert([lead]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create lead: ${error.message}`)
    return data as Lead
  } catch (err) {
    console.error('createLead error:', err)
    throw err
  }
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  if (!isSupabaseConfigured()) {
    const lead = mockLeads.find(l => l.id === id)
    if (!lead) throw new NotFoundError(`Lead with id ${id} not found`)
    return { ...lead, ...updates, updated_at: new Date().toISOString() }
  }
  try {
    const { data, error } = await supabase!.from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update lead: ${error.message}`)
    return data as Lead
  } catch (err) {
    console.error('updateLead error:', err)
    throw err
  }
}

export async function deleteLead(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const { error } = await supabase!.from('leads')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new APIError('DELETE_ERROR', `Failed to delete lead: ${error.message}`)
  } catch (err) {
    console.error('deleteLead error:', err)
    throw err
  }
}

// ============================================================================
// Projects API
// ============================================================================

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return mockProjects
  try {
    const { data, error } = await supabase!.from('projects')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch projects: ${error.message}`)
    return data as Project[]
  } catch (err) {
    console.error('getProjects error:', err)
    return mockProjects
  }
}

export async function getProjectById(id: string): Promise<Project> {
  if (!isSupabaseConfigured()) {
    const project = mockProjects.find(p => p.id === id)
    if (!project) throw new NotFoundError(`Project with id ${id} not found`)
    return project
  }
  try {
    const { data, error } = await supabase!.from('projects').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch project: ${error.message}`)
    if (!data) throw new NotFoundError(`Project with id ${id} not found`)
    return data as Project
  } catch (err) {
    console.error('getProjectById error:', err)
    throw err
  }
}

export async function getProjectsByLeadId(leadId: string): Promise<Project[]> {
  if (!isSupabaseConfigured()) return mockProjects.filter(p => p.lead_id === leadId)
  try {
    const { data, error } = await supabase!.from('projects')
      .select('*')
      .eq('lead_id', leadId)
      .is('deleted_at', null)
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch projects: ${error.message}`)
    return data as Project[]
  } catch (err) {
    console.error('getProjectsByLeadId error:', err)
    return mockProjects.filter(p => p.lead_id === leadId)
  }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  if (!isSupabaseConfigured()) {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newProject
  }
  try {
    const { data, error } = await supabase!.from('projects').insert([project]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create project: ${error.message}`)
    return data as Project
  } catch (err) {
    console.error('createProject error:', err)
    throw err
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  if (!isSupabaseConfigured()) {
    const project = mockProjects.find(p => p.id === id)
    if (!project) throw new NotFoundError(`Project with id ${id} not found`)
    return { ...project, ...updates, updated_at: new Date().toISOString() }
  }
  try {
    const { data, error } = await supabase!.from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update project: ${error.message}`)
    return data as Project
  } catch (err) {
    console.error('updateProject error:', err)
    throw err
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const { error } = await supabase!.from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new APIError('DELETE_ERROR', `Failed to delete project: ${error.message}`)
  } catch (err) {
    console.error('deleteProject error:', err)
    throw err
  }
}

// ============================================================================
// Tasks API
// ============================================================================

export async function getTasks(projectId?: string): Promise<ProjectTask[]> {
  if (!isSupabaseConfigured()) {
    return projectId ? mockTasks.filter(t => t.project_id === projectId) : mockTasks
  }
  try {
    let query = supabase!.from('project_tasks').select('*')
    if (projectId) query = query.eq('project_id', projectId)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch tasks: ${error.message}`)
    return data as ProjectTask[]
  } catch (err) {
    console.error('getTasks error:', err)
    return projectId ? mockTasks.filter(t => t.project_id === projectId) : mockTasks
  }
}

export async function getTaskById(id: string): Promise<ProjectTask> {
  if (!isSupabaseConfigured()) {
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new NotFoundError(`Task with id ${id} not found`)
    return task
  }
  try {
    const { data, error } = await supabase!.from('project_tasks').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch task: ${error.message}`)
    if (!data) throw new NotFoundError(`Task with id ${id} not found`)
    return data as ProjectTask
  } catch (err) {
    console.error('getTaskById error:', err)
    throw err
  }
}

export async function createTask(task: Omit<ProjectTask, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectTask> {
  if (!isSupabaseConfigured()) {
    const newTask: ProjectTask = {
      ...task,
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newTask
  }
  try {
    const { data, error } = await supabase!.from('project_tasks').insert([task]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create task: ${error.message}`)
    return data as ProjectTask
  } catch (err) {
    console.error('createTask error:', err)
    throw err
  }
}

export async function updateTask(id: string, updates: Partial<ProjectTask>): Promise<ProjectTask> {
  if (!isSupabaseConfigured()) {
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new NotFoundError(`Task with id ${id} not found`)
    return { ...task, ...updates, updated_at: new Date().toISOString() }
  }
  try {
    const { data, error } = await supabase!.from('project_tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update task: ${error.message}`)
    return data as ProjectTask
  } catch (err) {
    console.error('updateTask error:', err)
    throw err
  }
}

export async function deleteTask(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const { error } = await supabase!.from('project_tasks').delete().eq('id', id)
    if (error) throw new APIError('DELETE_ERROR', `Failed to delete task: ${error.message}`)
  } catch (err) {
    console.error('deleteTask error:', err)
    throw err
  }
}

// ============================================================================
// Bookings API
// ============================================================================

export async function getBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) return mockBookings
  try {
    const { data, error } = await supabase!.from('bookings')
      .select('*')
      .order('preferred_date', { ascending: true })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch bookings: ${error.message}`)
    return data as Booking[]
  } catch (err) {
    console.error('getBookings error:', err)
    return mockBookings
  }
}

export async function getBookingById(id: string): Promise<Booking> {
  if (!isSupabaseConfigured()) {
    const booking = mockBookings.find(b => b.id === id)
    if (!booking) throw new NotFoundError(`Booking with id ${id} not found`)
    return booking
  }
  try {
    const { data, error } = await supabase!.from('bookings').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch booking: ${error.message}`)
    if (!data) throw new NotFoundError(`Booking with id ${id} not found`)
    return data as Booking
  } catch (err) {
    console.error('getBookingById error:', err)
    throw err
  }
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
  if (!isSupabaseConfigured()) {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newBooking
  }
  try {
    const { data, error } = await supabase!.from('bookings').insert([booking]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create booking: ${error.message}`)
    return data as Booking
  } catch (err) {
    console.error('createBooking error:', err)
    throw err
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  if (!isSupabaseConfigured()) {
    const booking = mockBookings.find(b => b.id === id)
    if (!booking) throw new NotFoundError(`Booking with id ${id} not found`)
    return { ...booking, ...updates, updated_at: new Date().toISOString() }
  }
  try {
    const { data, error } = await supabase!.from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update booking: ${error.message}`)
    return data as Booking
  } catch (err) {
    console.error('updateBooking error:', err)
    throw err
  }
}

export async function deleteBooking(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return
  try {
    const { error } = await supabase!.from('bookings').delete().eq('id', id)
    if (error) throw new APIError('DELETE_ERROR', `Failed to delete booking: ${error.message}`)
  } catch (err) {
    console.error('deleteBooking error:', err)
    throw err
  }
}

// ============================================================================
// Agents API
// ============================================================================

export async function getAgents(): Promise<AgentConfig[]> {
  if (!isSupabaseConfigured()) return mockAgents
  try {
    const { data, error } = await supabase!.from('agents').select('*').order('name')
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch agents: ${error.message}`)
    return data as AgentConfig[]
  } catch (err) {
    console.error('getAgents error:', err)
    return mockAgents
  }
}

export async function getAgentById(id: string): Promise<AgentConfig> {
  if (!isSupabaseConfigured()) {
    const agent = mockAgents.find(a => a.id === id)
    if (!agent) throw new NotFoundError(`Agent with id ${id} not found`)
    return agent
  }
  try {
    const { data, error } = await supabase!.from('agents').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch agent: ${error.message}`)
    if (!data) throw new NotFoundError(`Agent with id ${id} not found`)
    return data as AgentConfig
  } catch (err) {
    console.error('getAgentById error:', err)
    throw err
  }
}

export async function updateAgent(id: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
  if (!isSupabaseConfigured()) {
    const agent = mockAgents.find(a => a.id === id)
    if (!agent) throw new NotFoundError(`Agent with id ${id} not found`)
    return { ...agent, ...updates }
  }
  try {
    const { data, error } = await supabase!.from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update agent: ${error.message}`)
    return data as AgentConfig
  } catch (err) {
    console.error('updateAgent error:', err)
    throw err
  }
}

// ============================================================================
// Approvals API
// ============================================================================

export async function getApprovals(): Promise<Approval[]> {
  if (!isSupabaseConfigured()) return mockApprovals
  try {
    const { data, error } = await supabase!.from('approvals')
      .select('*')
      .order('submitted_at', { ascending: false })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch approvals: ${error.message}`)
    return data as Approval[]
  } catch (err) {
    console.error('getApprovals error:', err)
    return mockApprovals
  }
}

export async function getApprovalById(id: string): Promise<Approval> {
  if (!isSupabaseConfigured()) {
    const approval = mockApprovals.find(a => a.id === id)
    if (!approval) throw new NotFoundError(`Approval with id ${id} not found`)
    return approval
  }
  try {
    const { data, error } = await supabase!.from('approvals').select('*').eq('id', id).single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch approval: ${error.message}`)
    if (!data) throw new NotFoundError(`Approval with id ${id} not found`)
    return data as Approval
  } catch (err) {
    console.error('getApprovalById error:', err)
    throw err
  }
}

export async function createApproval(approval: Omit<Approval, 'id' | 'reviewed_at'>): Promise<Approval> {
  if (!isSupabaseConfigured()) {
    const newApproval: Approval = {
      ...approval,
      id: `approval-${Date.now()}`,
      reviewed_at: null,
    }
    return newApproval
  }
  try {
    const { data, error } = await supabase!.from('approvals').insert([approval]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create approval: ${error.message}`)
    return data as Approval
  } catch (err) {
    console.error('createApproval error:', err)
    throw err
  }
}

export async function updateApprovalStatus(
  id: string,
  status: 'approved' | 'rejected' | 'revision_requested',
  reviewerNotes: string = ''
): Promise<Approval> {
  if (!isSupabaseConfigured()) {
    const approval = mockApprovals.find(a => a.id === id)
    if (!approval) throw new NotFoundError(`Approval with id ${id} not found`)
    return { ...approval, status, reviewed_at: new Date().toISOString(), reviewer_notes: reviewerNotes }
  }
  try {
    const { data, error } = await supabase!.from('approvals')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewerNotes,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new APIError('UPDATE_ERROR', `Failed to update approval: ${error.message}`)
    return data as Approval
  } catch (err) {
    console.error('updateApprovalStatus error:', err)
    throw err
  }
}

// ============================================================================
// Activities API
// ============================================================================

export async function getActivities(limit: number = 50): Promise<Activity[]> {
  if (!isSupabaseConfigured()) return mockActivities.slice(0, limit)
  try {
    const { data, error } = await supabase!.from('activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch activities: ${error.message}`)
    return data as Activity[]
  } catch (err) {
    console.error('getActivities error:', err)
    return mockActivities.slice(0, limit)
  }
}

export async function getActivitiesByEntityType(
  entityType: Activity['entity_type'],
  limit: number = 50
): Promise<Activity[]> {
  if (!isSupabaseConfigured()) {
    return mockActivities.filter(a => a.entity_type === entityType).slice(0, limit)
  }
  try {
    const { data, error } = await supabase!.from('activities')
      .select('*')
      .eq('entity_type', entityType)
      .order('timestamp', { ascending: false })
      .limit(limit)
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch activities: ${error.message}`)
    return data as Activity[]
  } catch (err) {
    console.error('getActivitiesByEntityType error:', err)
    return mockActivities.filter(a => a.entity_type === entityType).slice(0, limit)
  }
}

export async function createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
  if (!isSupabaseConfigured()) {
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
    }
    return newActivity
  }
  try {
    const { data, error } = await supabase!.from('activities').insert([activity]).select().single()
    if (error) throw new APIError('CREATE_ERROR', `Failed to create activity: ${error.message}`)
    return data as Activity
  } catch (err) {
    console.error('createActivity error:', err)
    throw err
  }
}

// ============================================================================
// Revenue API
// ============================================================================

export async function getRevenue(): Promise<RevenueMetric[]> {
  if (!isSupabaseConfigured()) return mockRevenue
  try {
    const { data, error } = await supabase!.from('revenue_metrics')
      .select('*')
      .order('month', { ascending: true })
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch revenue: ${error.message}`)
    return data as RevenueMetric[]
  } catch (err) {
    console.error('getRevenue error:', err)
    return mockRevenue
  }
}

// ============================================================================
// Dashboard Stats API
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) return mockStats
  try {
    const { data, error } = await supabase!.from('dashboard_stats').select('*').single()
    if (error) throw new APIError('FETCH_ERROR', `Failed to fetch stats: ${error.message}`)
    return { ...mockStats, ...data } as DashboardStats
  } catch (err) {
    console.error('getDashboardStats error:', err)
    return mockStats
  }
}

// ============================================================================
// Analytics Aggregation
// ============================================================================

export async function aggregateLeadMetrics(): Promise<{
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
  avgScore: number
}> {
  const leads = await getLeads()
  const byStatus: Record<string, number> = {}
  const bySource: Record<string, number> = {}
  let totalScore = 0

  leads.forEach(lead => {
    byStatus[lead.status] = (byStatus[lead.status] ?? 0) + 1
    bySource[lead.source] = (bySource[lead.source] ?? 0) + 1
    totalScore += lead.score
  })

  return {
    total: leads.length,
    byStatus,
    bySource,
    avgScore: leads.length > 0 ? totalScore / leads.length : 0,
  }
}

export async function aggregateProjectMetrics(): Promise<{
  total: number
  byStatus: Record<string, number>
  totalBudget: number
  avgProgress: number
}> {
  const projects = await getProjects()
  const byStatus: Record<string, number> = {}
  let totalBudget = 0
  let totalProgress = 0

  projects.forEach(project => {
    byStatus[project.status] = (byStatus[project.status] ?? 0) + 1
    totalBudget += project.budget
    totalProgress += project.progress
  })

  return {
    total: projects.length,
    byStatus,
    totalBudget,
    avgProgress: projects.length > 0 ? totalProgress / projects.length : 0,
  }
}

// ============================================================================
// File Upload Helpers
// ============================================================================

export async function uploadProjectAsset(
  projectId: string,
  file: File,
  assetType: 'proposal' | 'design' | 'output' | 'other'
): Promise<{ path: string; url: string }> {
  if (!isSupabaseConfigured()) {
    return {
      path: `projects/${projectId}/${assetType}/${file.name}`,
      url: URL.createObjectURL(file),
    }
  }
  try {
    const path = `projects/${projectId}/${assetType}/${Date.now()}-${file.name}`
    const { error } = await supabase!.storage.from('assets').upload(path, file)
    if (error) throw new APIError('UPLOAD_ERROR', `Failed to upload file: ${error.message}`)

    const { data } = supabase!.storage.from('assets').getPublicUrl(path)
    return { path, url: data.publicUrl }
  } catch (err) {
    console.error('uploadProjectAsset error:', err)
    throw err
  }
}

export async function uploadAgentOutput(
  agentId: string,
  file: File
): Promise<{ path: string; url: string }> {
  if (!isSupabaseConfigured()) {
    return {
      path: `agents/${agentId}/output/${file.name}`,
      url: URL.createObjectURL(file),
    }
  }
  try {
    const path = `agents/${agentId}/output/${Date.now()}-${file.name}`
    const { error } = await supabase!.storage.from('assets').upload(path, file)
    if (error) throw new APIError('UPLOAD_ERROR', `Failed to upload file: ${error.message}`)

    const { data } = supabase!.storage.from('assets').getPublicUrl(path)
    return { path, url: data.publicUrl }
  } catch (err) {
    console.error('uploadAgentOutput error:', err)
    throw err
  }
}

// ============================================================================
// Real-time Subscription Helpers
// ============================================================================

export type RealtimeCallback<T> = (payload: T) => void

export function subscribeToLeads(callback: RealtimeCallback<Lead>): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase!.channel('leads-realtime')
  channel.on(
    'postgres_changes' as never,
    { event: '*', schema: 'public', table: 'leads' } as never,
    (payload: { new: Lead }) => callback(payload.new)
  )

  channel.subscribe()
  return () => { supabase!.removeChannel(channel) }
}

export function subscribeToProjects(callback: RealtimeCallback<Project>): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase!.channel('projects-realtime')
  channel.on(
    'postgres_changes' as never,
    { event: '*', schema: 'public', table: 'projects' } as never,
    (payload: { new: Project }) => callback(payload.new)
  )

  channel.subscribe()
  return () => { supabase!.removeChannel(channel) }
}

export function subscribeToApprovals(callback: RealtimeCallback<Approval>): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase!.channel('approvals-realtime')
  channel.on(
    'postgres_changes' as never,
    { event: '*', schema: 'public', table: 'approvals' } as never,
    (payload: { new: Approval }) => callback(payload.new)
  )

  channel.subscribe()
  return () => { supabase!.removeChannel(channel) }
}

export function subscribeToActivities(callback: RealtimeCallback<Activity>): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase!.channel('activities-realtime')
  channel.on(
    'postgres_changes' as never,
    { event: '*', schema: 'public', table: 'activities' } as never,
    (payload: { new: Activity }) => callback(payload.new)
  )

  channel.subscribe()
  return () => { supabase!.removeChannel(channel) }
}

export function subscribeToTable<T>(
  table: string,
  callback: RealtimeCallback<T>
): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase!.channel(`${table}-realtime`)
  channel.on(
    'postgres_changes' as never,
    { event: '*', schema: 'public', table } as never,
    (payload: { new: T }) => callback(payload.new)
  )

  channel.subscribe()
  return () => { supabase!.removeChannel(channel) }
}
