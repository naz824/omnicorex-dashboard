import { useState, useEffect, useCallback } from 'react'
import type {
  Lead,
  Project,
  Booking,
  AgentConfig,
  Approval,
  Activity,
  RevenueMetric,
  DashboardStats,
  ProjectTask,
} from '@/types'
import * as api from '@/lib/api'
import * as auth from '@/lib/auth'

// ============================================================================
// Generic Data Fetching Hook
// ============================================================================

interface UseDataState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseDataReturn<T> extends UseDataState<T> {
  refetch: () => Promise<void>
}

function useData<T>(fetchFn: () => Promise<T>, deps: unknown[] = []): UseDataReturn<T> {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const data = await fetchFn()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
    }
  }, [fetchFn])

  useEffect(() => {
    refetch()
  }, deps)

  return { ...state, refetch }
}

// ============================================================================
// Leads Hook
// ============================================================================

export function useLeads(): UseDataReturn<Lead[]> {
  return useData<Lead[]>(api.getLeads)
}

export function useLead(id: string): UseDataReturn<Lead> {
  return useData<Lead>(() => api.getLeadById(id), [id])
}

// ============================================================================
// Projects Hook
// ============================================================================

export function useProjects(): UseDataReturn<Project[]> {
  return useData<Project[]>(api.getProjects)
}

export function useProject(id: string): UseDataReturn<Project> {
  return useData<Project>(() => api.getProjectById(id), [id])
}

export function useProjectsByLead(leadId: string): UseDataReturn<Project[]> {
  return useData<Project[]>(() => api.getProjectsByLeadId(leadId), [leadId])
}

// ============================================================================
// Tasks Hook
// ============================================================================

export function useTasks(projectId?: string): UseDataReturn<ProjectTask[]> {
  return useData<ProjectTask[]>(() => api.getTasks(projectId), [projectId])
}

export function useTask(id: string): UseDataReturn<ProjectTask> {
  return useData<ProjectTask>(() => api.getTaskById(id), [id])
}

// ============================================================================
// Bookings Hook
// ============================================================================

export function useBookings(): UseDataReturn<Booking[]> {
  return useData<Booking[]>(api.getBookings)
}

export function useBooking(id: string): UseDataReturn<Booking> {
  return useData<Booking>(() => api.getBookingById(id), [id])
}

// ============================================================================
// Agents Hook
// ============================================================================

export function useAgents(): UseDataReturn<AgentConfig[]> {
  return useData<AgentConfig[]>(api.getAgents)
}

export function useAgent(id: string): UseDataReturn<AgentConfig> {
  return useData<AgentConfig>(() => api.getAgentById(id), [id])
}

// ============================================================================
// Approvals Hook
// ============================================================================

export function useApprovals(): UseDataReturn<Approval[]> {
  return useData<Approval[]>(api.getApprovals)
}

export function useApproval(id: string): UseDataReturn<Approval> {
  return useData<Approval>(() => api.getApprovalById(id), [id])
}

// ============================================================================
// Activities Hook
// ============================================================================

export interface UseActivitiesOptions {
  limit?: number
  entityType?: Activity['entity_type']
}

export function useActivities(options: UseActivitiesOptions = {}): UseDataReturn<Activity[]> {
  const { limit = 50, entityType } = options

  return useData<Activity[]>(
    () =>
      entityType
        ? api.getActivitiesByEntityType(entityType, limit)
        : api.getActivities(limit),
    [limit, entityType]
  )
}

// ============================================================================
// Revenue Hook
// ============================================================================

export function useRevenue(): UseDataReturn<RevenueMetric[]> {
  return useData<RevenueMetric[]>(api.getRevenue)
}

// ============================================================================
// Dashboard Stats Hook
// ============================================================================

export function useDashboardStats(): UseDataReturn<DashboardStats> {
  return useData<DashboardStats>(api.getDashboardStats)
}

// ============================================================================
// Analytics Hooks
// ============================================================================

export function useLeadMetrics() {
  return useData(() => api.aggregateLeadMetrics())
}

export function useProjectMetrics() {
  return useData(() => api.aggregateProjectMetrics())
}

// ============================================================================
// Auth Hook
// ============================================================================

export interface UseAuthReturn {
  user: auth.AuthUser | null
  loading: boolean
  error: Error | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<{
    user: auth.AuthUser | null
    loading: boolean
    error: Error | null
  }>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Initialize auth on mount
    auth.initializeAuth().then(user => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }))
    })

    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChange(user => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }))
    })

    return unsubscribe
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await auth.signInWithEmail(email, password)
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
      throw error
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, metadata?: { name?: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await auth.signUp(email, password, metadata)
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await auth.signOut()
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
      throw error
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await auth.resetPassword(email)
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
      throw error
    }
  }, [])

  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await auth.updateProfile(data)
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
      throw error
    }
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.user !== null,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }
}

// ============================================================================
// Real-time Hook
// ============================================================================

export interface UseRealtimeOptions<T> {
  table: string
  onDataChange?: (data: T) => void
}

export function useRealtime<T>(options: UseRealtimeOptions<T>): void {
  useEffect(() => {
    const unsubscribe = api.subscribeToTable<T>(options.table, data => {
      if (options.onDataChange) {
        options.onDataChange(data)
      }
    })

    return unsubscribe
  }, [options.table, options.onDataChange])
}

export function useRealtimeLeads(callback: (lead: Lead) => void): void {
  useEffect(() => {
    const unsubscribe = api.subscribeToLeads(callback)
    return unsubscribe
  }, [callback])
}

export function useRealtimeProjects(callback: (project: Project) => void): void {
  useEffect(() => {
    const unsubscribe = api.subscribeToProjects(callback)
    return unsubscribe
  }, [callback])
}

export function useRealtimeApprovals(callback: (approval: Approval) => void): void {
  useEffect(() => {
    const unsubscribe = api.subscribeToApprovals(callback)
    return unsubscribe
  }, [callback])
}

export function useRealtimeActivities(callback: (activity: Activity) => void): void {
  useEffect(() => {
    const unsubscribe = api.subscribeToActivities(callback)
    return unsubscribe
  }, [callback])
}
