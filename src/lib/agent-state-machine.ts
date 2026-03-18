// ============================================================================
// Agent State Machine — Lightweight FSM for Agent Lifecycle
// ============================================================================
// Implements a state machine with no external dependencies for managing
// agent workflow states, transitions, and history

import type { AgentId } from './agent-capabilities'

// ============================================================================
// Type Definitions
// ============================================================================

export type AgentState =
  | 'idle'
  | 'preparing'
  | 'executing'
  | 'awaiting_approval'
  | 'completed'
  | 'error'
  | 'paused'

export type AgentTransition =
  | 'start_task'
  | 'begin_execution'
  | 'request_approval'
  | 'approve'
  | 'reject'
  | 'revise'
  | 'complete'
  | 'fail'
  | 'pause'
  | 'resume'
  | 'reset'

export interface AgentEvent {
  transition: AgentTransition
  fromState: AgentState
  toState: AgentState
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface StateMachineInstance {
  getState(): AgentState
  transition(t: AgentTransition, metadata?: Record<string, unknown>): boolean
  subscribe(listener: (state: AgentState) => void): () => void
  getHistory(): AgentEvent[]
  canTransition(t: AgentTransition): boolean
  reset(): void
}

// ============================================================================
// State Transition Rules
// ============================================================================

const VALID_TRANSITIONS: Record<AgentState, AgentTransition[]> = {
  idle: ['start_task', 'reset'],
  preparing: ['begin_execution', 'fail', 'reset'],
  executing: ['request_approval', 'complete', 'fail', 'pause', 'reset'],
  awaiting_approval: ['approve', 'reject', 'revise', 'reset'],
  completed: ['start_task', 'reset'],
  error: ['start_task', 'reset'],
  paused: ['resume', 'reset'],
}

const TRANSITION_MAP: Record<AgentState, Record<AgentTransition, AgentState>> = {
  idle: {
    start_task: 'preparing',
    reset: 'idle',
    begin_execution: 'idle',
    request_approval: 'idle',
    approve: 'idle',
    reject: 'idle',
    revise: 'idle',
    complete: 'idle',
    fail: 'idle',
    pause: 'idle',
    resume: 'idle',
  },
  preparing: {
    begin_execution: 'executing',
    fail: 'error',
    reset: 'idle',
    start_task: 'preparing',
    request_approval: 'preparing',
    approve: 'preparing',
    reject: 'preparing',
    revise: 'preparing',
    complete: 'preparing',
    pause: 'preparing',
    resume: 'preparing',
  },
  executing: {
    request_approval: 'awaiting_approval',
    complete: 'completed',
    fail: 'error',
    pause: 'paused',
    reset: 'idle',
    start_task: 'executing',
    begin_execution: 'executing',
    approve: 'executing',
    reject: 'executing',
    revise: 'executing',
    resume: 'executing',
  },
  awaiting_approval: {
    approve: 'executing',
    reject: 'completed',
    revise: 'preparing',
    reset: 'idle',
    start_task: 'awaiting_approval',
    begin_execution: 'awaiting_approval',
    request_approval: 'awaiting_approval',
    complete: 'awaiting_approval',
    fail: 'awaiting_approval',
    pause: 'awaiting_approval',
    resume: 'awaiting_approval',
  },
  completed: {
    start_task: 'preparing',
    reset: 'idle',
    begin_execution: 'completed',
    request_approval: 'completed',
    approve: 'completed',
    reject: 'completed',
    revise: 'completed',
    complete: 'completed',
    fail: 'completed',
    pause: 'completed',
    resume: 'completed',
  },
  error: {
    start_task: 'preparing',
    reset: 'idle',
    begin_execution: 'error',
    request_approval: 'error',
    approve: 'error',
    reject: 'error',
    revise: 'error',
    complete: 'error',
    fail: 'error',
    pause: 'error',
    resume: 'error',
  },
  paused: {
    resume: 'executing',
    reset: 'idle',
    start_task: 'paused',
    begin_execution: 'paused',
    request_approval: 'paused',
    approve: 'paused',
    reject: 'paused',
    revise: 'paused',
    complete: 'paused',
    fail: 'paused',
    pause: 'paused',
  },
}

// ============================================================================
// Retry Logic
// ============================================================================

interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
}

function calculateBackoff(attemptNumber: number, config: RetryConfig): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attemptNumber)
  const jitter = Math.random() * config.baseDelayMs
  return Math.min(exponentialDelay + jitter, config.maxDelayMs)
}

// ============================================================================
// State Machine Factory
// ============================================================================

/**
 * Create a new state machine instance for an agent
 */
export function createAgentStateMachine(_agentId: AgentId): StateMachineInstance {
  let currentState: AgentState = 'idle'
  const history: AgentEvent[] = []
  const listeners = new Set<(state: AgentState) => void>()

  function notifyListeners(state: AgentState): void {
    listeners.forEach((listener) => listener(state))
  }

  function getState(): AgentState {
    return currentState
  }

  function canTransition(t: AgentTransition): boolean {
    const validTransitions = VALID_TRANSITIONS[currentState] || []
    return validTransitions.includes(t)
  }

  function transition(t: AgentTransition, metadata?: Record<string, unknown>): boolean {
    if (!canTransition(t)) {
      console.warn(
        `Cannot transition from ${currentState} via ${t}. Valid transitions: ${
          VALID_TRANSITIONS[currentState]?.join(', ') || 'none'
        }`
      )
      return false
    }

    const nextState = TRANSITION_MAP[currentState][t]
    const event: AgentEvent = {
      transition: t,
      fromState: currentState,
      toState: nextState,
      timestamp: Date.now(),
      metadata,
    }

    history.push(event)
    currentState = nextState

    notifyListeners(currentState)
    return true
  }

  function subscribe(listener: (state: AgentState) => void): () => void {
    listeners.add(listener)
    // Immediately call listener with current state
    listener(currentState)
    // Return unsubscribe function
    return () => {
      listeners.delete(listener)
    }
  }

  function getHistory(): AgentEvent[] {
    return [...history]
  }

  function reset(): void {
    currentState = 'idle'
    notifyListeners(currentState)
  }

  return {
    getState,
    transition,
    subscribe,
    getHistory,
    canTransition,
    reset,
  }
}

// ============================================================================
// Retry Helper
// ============================================================================

/**
 * Execute a function with exponential backoff retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const mergedConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastErr: Error | null = null

  for (let attempt = 0; attempt <= mergedConfig.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastErr = error instanceof Error ? error : new Error(String(error))

      if (attempt < mergedConfig.maxRetries) {
        const delayMs = calculateBackoff(attempt, mergedConfig)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw new Error(
    `Failed after ${mergedConfig.maxRetries} retries: ${lastErr?.message || 'Unknown error'}`
  )
}

// ============================================================================
// Event Emitter Pattern for State Changes
// ============================================================================

export interface StateTransitionListener {
  onBeforeTransition?: (transition: AgentTransition, fromState: AgentState) => void
  onAfterTransition?: (transition: AgentTransition, toState: AgentState) => void
  onError?: (error: Error) => void
}

/**
 * Create a state machine with event listeners
 */
export function createAgentStateMachineWithListeners(
  agentId: AgentId,
  listeners?: StateTransitionListener
): StateMachineInstance & { getLastError: () => Error | null } {
  const machine = createAgentStateMachine(agentId as AgentId)
  let lastError: Error | null = null

  const originalTransition = machine.transition
  machine.transition = function (t: AgentTransition, metadata?: Record<string, unknown>): boolean {
    const currentState = machine.getState()

    if (listeners?.onBeforeTransition) {
      listeners.onBeforeTransition(t, currentState)
    }

    try {
      const result = originalTransition.call(this, t, metadata)

      if (result && listeners?.onAfterTransition) {
        listeners.onAfterTransition(t, machine.getState())
      }

      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      lastError = err

      if (listeners?.onError) {
        listeners.onError(err)
      }

      throw err
    }
  }

  return {
    ...machine,
    getLastError: () => lastError,
  }
}
