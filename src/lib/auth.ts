import { supabase, isSupabaseConfigured } from './supabase'
import type { User } from '@supabase/supabase-js'
import { APIError } from './api'

// ============================================================================
// Mock User for Demo Mode
// ============================================================================

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'user'
  metadata?: Record<string, unknown>
}

export const mockUser: AuthUser = {
  id: 'demo-user',
  email: 'nasir@omnicorex.com',
  name: 'Nasir Chase',
  role: 'owner',
  metadata: {
    provider: 'mock',
    isDemo: true,
  },
}

// ============================================================================
// Auth State Management
// ============================================================================

let currentUser: AuthUser | null = null
let authStateCallbacks: ((user: AuthUser | null) => void)[] = []

function notifyAuthStateChange(user: AuthUser | null): void {
  currentUser = user
  authStateCallbacks.forEach(callback => callback(user))
}

// ============================================================================
// Auth Functions
// ============================================================================

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseConfigured()) {
    notifyAuthStateChange(mockUser)
    return mockUser
  }

  try {
    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new APIError('AUTH_ERROR', `Sign in failed: ${error.message}`)

    const user = mapSupabaseUserToAuthUser(data.user)
    notifyAuthStateChange(user)
    return user
  } catch (err) {
    console.error('signInWithEmail error:', err)
    throw err
  }
}

export async function signUp(
  email: string,
  password: string,
  metadata?: { name?: string; role?: string }
): Promise<AuthUser> {
  if (!isSupabaseConfigured()) {
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      name: metadata?.name || email.split('@')[0],
      role: (metadata?.role as 'owner' | 'admin' | 'user') || 'user',
      metadata,
    }
    notifyAuthStateChange(newUser)
    return newUser
  }

  try {
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) throw new APIError('AUTH_ERROR', `Sign up failed: ${error.message}`)

    if (!data.user) throw new APIError('AUTH_ERROR', 'Sign up failed: no user returned')

    const user = mapSupabaseUserToAuthUser(data.user)
    notifyAuthStateChange(user)
    return user
  } catch (err) {
    console.error('signUp error:', err)
    throw err
  }
}

export async function signInWithGoogle(): Promise<AuthUser> {
  if (!isSupabaseConfigured()) {
    notifyAuthStateChange(mockUser)
    return mockUser
  }

  try {
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw new APIError('AUTH_ERROR', `Google sign in failed: ${error.message}`)

    // OAuth always redirects — the data contains provider + url, not a user.
    // The user will be available after redirect via onAuthStateChange.
    // Return null to indicate redirect is in progress.
    return null as unknown as AuthUser
  } catch (err) {
    console.error('signInWithGoogle error:', err)
    throw err
  }
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    notifyAuthStateChange(null)
    return
  }

  try {
    const { error } = await supabase!.auth.signOut()
    if (error) throw new APIError('AUTH_ERROR', `Sign out failed: ${error.message}`)
    notifyAuthStateChange(null)
  } catch (err) {
    console.error('signOut error:', err)
    throw err
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    return currentUser || mockUser
  }

  try {
    const { data, error } = await supabase!.auth.getUser()
    if (error || !data.user) {
      notifyAuthStateChange(null)
      return null
    }

    const user = mapSupabaseUserToAuthUser(data.user)
    notifyAuthStateChange(user)
    return user
  } catch (err) {
    console.error('getCurrentUser error:', err)
    return null
  }
}

export async function resetPassword(email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log(`Password reset email would be sent to ${email}`)
    return
  }

  try {
    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw new APIError('AUTH_ERROR', `Password reset failed: ${error.message}`)
  } catch (err) {
    console.error('resetPassword error:', err)
    throw err
  }
}

export async function updateProfile(data: {
  name?: string
  email?: string
  metadata?: Record<string, unknown>
}): Promise<AuthUser> {
  if (!isSupabaseConfigured()) {
    const updated: AuthUser = {
      ...mockUser,
      name: data.name || mockUser.name,
      email: data.email || mockUser.email,
      metadata: { ...mockUser.metadata, ...data.metadata },
    }
    notifyAuthStateChange(updated)
    return updated
  }

  try {
    const { data: userData, error } = await supabase!.auth.updateUser({
      email: data.email,
      data: data.metadata,
    })

    if (error) throw new APIError('AUTH_ERROR', `Profile update failed: ${error.message}`)

    const user = mapSupabaseUserToAuthUser(userData.user)
    notifyAuthStateChange(user)
    return user
  } catch (err) {
    console.error('updateProfile error:', err)
    throw err
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  authStateCallbacks.push(callback)

  // Call immediately with current state
  callback(currentUser)

  // Return unsubscribe function
  return () => {
    authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback)
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function mapSupabaseUserToAuthUser(supabaseUser: User): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || 'unknown@example.com',
    name: (supabaseUser.user_metadata?.name as string) || supabaseUser.email?.split('@')[0] || 'User',
    role: (supabaseUser.user_metadata?.role as 'owner' | 'admin' | 'user') || 'user',
    metadata: supabaseUser.user_metadata,
  }
}

export async function initializeAuth(): Promise<AuthUser | null> {
  // Initialize auth state on app load
  if (isSupabaseConfigured()) {
    // Set up auth state listener
    supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        notifyAuthStateChange(mapSupabaseUserToAuthUser(session.user))
      } else {
        notifyAuthStateChange(null)
      }
    })

    // Get current user if logged in
    const user = await getCurrentUser()
    return user
  } else {
    // Demo mode
    notifyAuthStateChange(mockUser)
    return mockUser
  }
}
