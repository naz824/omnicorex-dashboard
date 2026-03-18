// ============================================================================
// Task Queue Manager — Priority Queue for Agent System
// ============================================================================
// Implements a priority queue for managing agent tasks with lifecycle tracking,
// assignment, and conflict detection

import type { AgentId, AgentCapabilityTag } from './agent-capabilities'

// ============================================================================
// Type Definitions
// ============================================================================

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'
export type TaskStatus = 'queued' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'failed'
export type TaskType =
  | 'workflow'
  | 'sales'
  | 'marketing'
  | 'design'
  | 'frontend'
  | 'backend'
  | 'qa'
  | 'operations'
  | 'approval'

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  requiredCapabilities: AgentCapabilityTag[]
  assignedAgentId: AgentId | null
  createdAt: number
  updatedAt: number
  dueDate: number | null
  estimatedDurationMs: number
  dependencies: string[]
  conflictsWith: string[]
  metadata: Record<string, unknown>
}

export interface QueueStats {
  totalTasks: number
  queuedTasks: number
  assignedTasks: number
  inProgressTasks: number
  reviewTasks: number
  completedTasks: number
  failedTasks: number
  averageWaitTimeMs: number
  oldestQueuedTaskAgeMs: number
}

export interface TaskQueueManager {
  enqueueTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedAgentId'>): Task
  assignTask(taskId: string, agentId: AgentId): boolean
  updateTaskStatus(taskId: string, status: TaskStatus): boolean
  completeTask(taskId: string, result?: Record<string, unknown>): boolean
  failTask(taskId: string, error: string): boolean
  getTask(taskId: string): Task | null
  getTasksByStatus(status: TaskStatus): Task[]
  getTasksByAgent(agentId: AgentId): Task[]
  getNextTask(agentId: AgentId): Task | null
  getQueueStats(): QueueStats
  checkConflicts(taskId: string): string[]
  deduplicateTask(taskId: string): boolean
  clearCompletedTasks(olderThanMs: number): number
}

// ============================================================================
// Priority Queue Implementation
// ============================================================================

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  critical: 1000,
  high: 100,
  medium: 10,
  low: 1,
}

class PriorityQueue {
  private tasks: Task[] = []

  add(task: Task): void {
    this.tasks.push(task)
    this.tasks.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.createdAt - b.createdAt
    })
  }

  remove(taskId: string): Task | null {
    const idx = this.tasks.findIndex((t) => t.id === taskId)
    if (idx === -1) return null
    const [task] = this.tasks.splice(idx, 1)
    return task
  }

  get(taskId: string): Task | null {
    return this.tasks.find((t) => t.id === taskId) || null
  }

  getAll(): Task[] {
    return [...this.tasks]
  }

  peek(): Task | null {
    return this.tasks[0] || null
  }

  update(task: Task): boolean {
    const idx = this.tasks.findIndex((t) => t.id === task.id)
    if (idx === -1) return false
    this.tasks[idx] = task
    // Re-sort after update
    this.tasks.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.createdAt - b.createdAt
    })
    return true
  }

  size(): number {
    return this.tasks.length
  }

  clear(): void {
    this.tasks = []
  }
}

// ============================================================================
// Task Queue Factory
// ============================================================================

/**
 * Create a task queue manager instance
 */
export function createTaskQueue(): TaskQueueManager {
  const queue = new PriorityQueue()
  const completedTasks: Task[] = []
  const taskHashes = new Map<string, string>()

  function generateTaskHash(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedAgentId'>): string {
    const hashInput = `${task.title}|${task.type}|${task.description}`
    // Simple hash function for task deduplication
    let hash = 0
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(36)}`
  }

  function generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }

  function enqueueTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedAgentId'>
  ): Task {
    const now = Date.now()
    const newTask: Task = {
      ...task,
      id: generateTaskId(),
      createdAt: now,
      updatedAt: now,
      status: 'queued',
      assignedAgentId: null,
    }

    const hash = generateTaskHash(task)
    taskHashes.set(newTask.id, hash)

    queue.add(newTask)
    return newTask
  }

  function assignTask(taskId: string, agentId: AgentId): boolean {
    const task = queue.get(taskId)
    if (!task) return false

    if (task.status !== 'queued') {
      console.warn(`Cannot assign task ${taskId} with status ${task.status}`)
      return false
    }

    task.assignedAgentId = agentId
    task.status = 'assigned'
    task.updatedAt = Date.now()

    return queue.update(task)
  }

  function updateTaskStatus(taskId: string, status: TaskStatus): boolean {
    const task = queue.get(taskId)
    if (!task) return false

    task.status = status
    task.updatedAt = Date.now()

    return queue.update(task)
  }

  function completeTask(taskId: string, result?: Record<string, unknown>): boolean {
    const task = queue.get(taskId)
    if (!task) return false

    task.status = 'completed'
    task.updatedAt = Date.now()
    task.metadata = { ...task.metadata, result }

    queue.remove(taskId)
    completedTasks.push(task)
    return true
  }

  function failTask(taskId: string, error: string): boolean {
    const task = queue.get(taskId)
    if (!task) return false

    task.status = 'failed'
    task.updatedAt = Date.now()
    task.metadata = { ...task.metadata, error }

    queue.remove(taskId)
    completedTasks.push(task)
    return true
  }

  function getTask(taskId: string): Task | null {
    return queue.get(taskId) || completedTasks.find((t) => t.id === taskId) || null
  }

  function getTasksByStatus(status: TaskStatus): Task[] {
    return queue.getAll().filter((t) => t.status === status)
  }

  function getTasksByAgent(agentId: AgentId): Task[] {
    return queue.getAll().filter((t) => t.assignedAgentId === agentId)
  }

  function getNextTask(_agentId: AgentId): Task | null {
    const unassignedQueued = queue
      .getAll()
      .filter(
        (t) =>
          t.status === 'queued' &&
          t.assignedAgentId === null &&
          t.dependencies.length === 0
      )

    if (unassignedQueued.length === 0) return null

    // Return the first unassigned queued task
    return unassignedQueued[0] || null
  }

  function getQueueStats(): QueueStats {
    const allTasks = queue.getAll()
    const queuedTasks = allTasks.filter((t) => t.status === 'queued')
    const assignedTasks = allTasks.filter((t) => t.status === 'assigned')
    const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress')
    const reviewTasks = allTasks.filter((t) => t.status === 'review')

    const now = Date.now()
    const waitTimes = queuedTasks.map((t) => now - t.createdAt)
    const averageWaitTimeMs =
      waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0
    const oldestQueuedTaskAgeMs =
      queuedTasks.length > 0 ? Math.max(...waitTimes) : 0

    return {
      totalTasks: allTasks.length + completedTasks.length,
      queuedTasks: queuedTasks.length,
      assignedTasks: assignedTasks.length,
      inProgressTasks: inProgressTasks.length,
      reviewTasks: reviewTasks.length,
      completedTasks: completedTasks.filter((t) => t.status === 'completed').length,
      failedTasks: completedTasks.filter((t) => t.status === 'failed').length,
      averageWaitTimeMs: Math.round(averageWaitTimeMs),
      oldestQueuedTaskAgeMs: Math.round(oldestQueuedTaskAgeMs),
    }
  }

  function checkConflicts(taskId: string): string[] {
    const task = queue.get(taskId)
    if (!task) return []

    const allTasks = queue.getAll()
    const conflicts: string[] = []

    for (const otherTask of allTasks) {
      if (otherTask.id === taskId) continue

      // Check if task explicitly conflicts with other task
      if (
        task.conflictsWith.includes(otherTask.id) ||
        otherTask.conflictsWith.includes(taskId)
      ) {
        conflicts.push(otherTask.id)
      }

      // Check if both are assigned to same agent and both are in_progress
      if (
        task.assignedAgentId === otherTask.assignedAgentId &&
        task.status === 'in_progress' &&
        otherTask.status === 'in_progress'
      ) {
        conflicts.push(otherTask.id)
      }
    }

    return conflicts
  }

  function deduplicateTask(taskId: string): boolean {
    const task = queue.get(taskId)
    if (!task) return false

    const hash = taskHashes.get(taskId)
    if (!hash) return false

    const duplicates = queue
      .getAll()
      .filter((t) => t.id !== taskId && taskHashes.get(t.id) === hash)

    if (duplicates.length > 0) {
      queue.remove(taskId)
      return true
    }

    return false
  }

  function clearCompletedTasks(olderThanMs: number): number {
    const now = Date.now()
    let clearedCount = 0

    for (let i = completedTasks.length - 1; i >= 0; i--) {
      const task = completedTasks[i]
      if (now - task.updatedAt > olderThanMs) {
        completedTasks.splice(i, 1)
        taskHashes.delete(task.id)
        clearedCount++
      }
    }

    return clearedCount
  }

  return {
    enqueueTask,
    assignTask,
    updateTaskStatus,
    completeTask,
    failTask,
    getTask,
    getTasksByStatus,
    getTasksByAgent,
    getNextTask,
    getQueueStats,
    checkConflicts,
    deduplicateTask,
    clearCompletedTasks,
  }
}

// ============================================================================
// Task Builder Utility
// ============================================================================

export function createTaskBuilder(title: string, type: TaskType) {
  const task: Partial<Task> = {
    title,
    type,
    priority: 'medium',
    description: '',
    requiredCapabilities: [],
    dependencies: [],
    conflictsWith: [],
    estimatedDurationMs: 0,
    dueDate: null,
    metadata: {},
  }

  return {
    withDescription(desc: string) {
      task.description = desc
      return this
    },
    withPriority(priority: TaskPriority) {
      task.priority = priority
      return this
    },
    withCapabilities(...capabilities: AgentCapabilityTag[]) {
      task.requiredCapabilities = capabilities
      return this
    },
    withEstimatedDuration(ms: number) {
      task.estimatedDurationMs = ms
      return this
    },
    withDueDate(timestamp: number) {
      task.dueDate = timestamp
      return this
    },
    withDependencies(...ids: string[]) {
      task.dependencies = ids
      return this
    },
    withConflicts(...ids: string[]) {
      task.conflictsWith = ids
      return this
    },
    withMetadata(metadata: Record<string, unknown>) {
      task.metadata = metadata
      return this
    },
    build(): Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedAgentId'> {
      return task as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedAgentId'>
    },
  }
}
