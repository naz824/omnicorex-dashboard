import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authLib from '@/lib/auth'

// ============================================================================
// Auth Context Type
// ============================================================================

export interface AuthContextType {
  user: authLib.AuthUser | null
  loading: boolean
  error: Error | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>
}

// ============================================================================
// Create Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================================================
// Auth Provider Component
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<{
    user: authLib.AuthUser | null
    loading: boolean
    error: Error | null
  }>({
    user: null,
    loading: true,
    error: null,
  })

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        const user = await authLib.initializeAuth()
        setState(prev => ({
          ...prev,
          user,
          loading: false,
          error: null,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }))
      }
    }

    initAuth()

    // Subscribe to auth state changes
    const unsubscribe = authLib.onAuthStateChange(user => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }))
    })

    return unsubscribe
  }, [])

  // Auth methods
  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await authLib.signInWithEmail(email, password)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState(prev => ({
        ...prev,
        loading: false,
        error: err,
      }))
      throw err
    }
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, metadata?: { name?: string }): Promise<void> => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        await authLib.signUp(email, password, metadata)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setState(prev => ({
          ...prev,
          loading: false,
          error: err,
        }))
        throw err
      }
    },
    []
  )

  const signOut = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await authLib.signOut()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState(prev => ({
        ...prev,
        loading: false,
        error: err,
      }))
      throw err
    }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await authLib.resetPassword(email)
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState(prev => ({
        ...prev,
        loading: false,
        error: err,
      }))
      throw err
    }
  }, [])

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string }): Promise<void> => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        await authLib.updateProfile(data)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setState(prev => ({
          ...prev,
          loading: false,
          error: err,
        }))
        throw err
      }
    },
    []
  )

  const value: AuthContextType = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================================
// useAuthContext Hook
// ============================================================================

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}

// ============================================================================
// Consumer Component (for class components)
// ============================================================================

interface AuthConsumerProps {
  children: (auth: AuthContextType) => React.ReactNode
}

export function AuthConsumer({ children }: AuthConsumerProps): React.ReactElement {
  const auth = useAuthContext()
  return <>{children(auth)}</>
}
