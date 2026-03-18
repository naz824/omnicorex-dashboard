// ============================================================================
// Agent Orchestrator — Supervisor/Orchestrator Pattern
// ============================================================================
// Manages multi-agent workflows with dependency handling, parallel execution,
// and human-in-the-loop checkpoints

import {
  type AgentId,
  AGENT_CAPABILITIES,
  routeTaskByCapability,
} from './agent-capabilities'
import {
  type TaskQueueManager,
  createTaskQueue,
} from './task-queue'
import { createAgentStateMachine } from './agent-state-machine'

// ============================================================================
// Type Definitions
// ============================================================================

export type WorkflowStatus = 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'failed'
export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'

export interface WorkflowStep {
  id: string
  title: string
  description: string
  taskType: string
  requiredCapabilities: string[]
  dependsOn: string[]
  requiresApproval: boolean
  estimatedDurationMs: number
  metadata?: Record<string, unknown>
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  priority: 'critical' | 'high' | 'medium' | 'low'
  createdAt: number
  createdBy: string
  dueDate?: number
  metadata?: Record<string, unknown>
}

export interface WorkflowExecution {
  workflowId: string
  executionId: string
  status: WorkflowStatus
  steps: Map<string, WorkflowStepStatus>
  assignedAgents: Map<string, AgentId>
  startedAt: number
  completedAt: number | null
  approvalsPending: string[]
  activities: WorkflowActivity[]
}

export interface WorkflowActivity {
  timestamp: number
  agentId: AgentId | null
  action: string
  description: string
  stepId?: string
  metadata?: Record<string, unknown>
}

export interface OrchestratorInstance {
  submitWorkflow(workflow: Workflow): WorkflowExecution
  getWorkflowStatus(workflowId: string): WorkflowExecution | null
  approveStep(executionId: string, stepId: string): boolean
  rejectStep(executionId: string, stepId: string): boolean
  reviseStep(executionId: string, stepId: string): boolean
  getActivities(executionId: string): WorkflowActivity[]
  getMetrics(): OrchestratorMetrics
}

export interface OrchestratorMetrics {
  totalWorkflows: number
  activeWorkflows: number
  completedWorkflows: number
  failedWorkflows: number
  averageExecutionTimeMs: number
  successRate: number
  agentUtilization: Record<AgentId, number>
}

// ============================================================================
// Orchestrator Implementation
// ============================================================================

/**
 * Create an orchestrator instance for managing multi-agent workflows
 */
export function createOrchestrator(): OrchestratorInstance {
  const taskQueue: TaskQueueManager = createTaskQueue()
  const executions = new Map<string, WorkflowExecution>()
  const agentStateMachines = new Map<AgentId, ReturnType<typeof createAgentStateMachine>>()
  const activityLog: WorkflowActivity[] = []

  // Initialize state machines for all agents
  const agentIds: AgentId[] = [
    'apex',
    'nova',
    'meridian',
    'prism',
    'vertex',
    'nexus',
    'sentinel',
    'compass',
  ]
  for (const agentId of agentIds) {
    agentStateMachines.set(agentId, createAgentStateMachine(agentId))
  }

  function generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }

  function logActivity(
    executionId: string,
    agentId: AgentId | null,
    action: string,
    description: string,
    stepId?: string,
    metadata?: Record<string, unknown>
  ): void {
    const activity: WorkflowActivity = {
      timestamp: Date.now(),
      agentId,
      action,
      description,
      stepId,
      metadata,
    }

    activityLog.push(activity)

    const execution = executions.get(executionId)
    if (execution) {
      execution.activities.push(activity)
    }
  }

  function submitWorkflow(workflow: Workflow): WorkflowExecution {
    const executionId = generateExecutionId()
    const execution: WorkflowExecution = {
      workflowId: workflow.id,
      executionId,
      status: 'pending',
      steps: new Map(),
      assignedAgents: new Map(),
      startedAt: Date.now(),
      completedAt: null,
      approvalsPending: [],
      activities: [],
    }

    // Initialize step statuses
    for (const step of workflow.steps) {
      execution.steps.set(step.id, 'pending')
    }

    executions.set(executionId, execution)

    logActivity(
      executionId,
      'apex',
      'Workflow submitted',
      `Started workflow: ${workflow.name}`,
      undefined,
      { workflowId: workflow.id, stepCount: workflow.steps.length }
    )

    // Decompose workflow into tasks and route to agents
    decomposeworkflow(executionId, workflow, execution)

    return execution
  }

  function decomposeworkflow(
    executionId: string,
    workflow: Workflow,
    execution: WorkflowExecution
  ): void {
    const execution_ex = executions.get(executionId)
    if (!execution_ex) return

    execution_ex.status = 'in_progress'

    // Sort steps by dependencies
    const sortedSteps = topologicalSort(workflow.steps)

    for (const step of sortedSteps) {
      // Route step to most capable agent
      const routingDecision = routeTaskByCapability({
        id: step.id,
        title: step.title,
        description: step.description,
        type: step.taskType as any,
        priority: workflow.priority,
        status: 'queued',
        requiredCapabilities: step.requiredCapabilities as any[],
        assignedAgentId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        dueDate: workflow.dueDate || null,
        estimatedDurationMs: step.estimatedDurationMs,
        dependencies: step.dependsOn,
        conflictsWith: [],
        metadata: step.metadata || {},
      })

      const agentId = routingDecision.agentId
      execution.assignedAgents.set(step.id, agentId)

      logActivity(
        executionId,
        agentId,
        'Step assigned',
        `Assigned step ${step.title} to ${AGENT_CAPABILITIES[agentId].name}`,
        step.id,
        { confidence: routingDecision.confidence, reason: routingDecision.reason }
      )

      // Enqueue task
      taskQueue.enqueueTask({
        title: step.title,
        description: step.description,
        type: step.taskType as any,
        priority: workflow.priority,
        requiredCapabilities: step.requiredCapabilities as any[],
        estimatedDurationMs: step.estimatedDurationMs,
        dueDate: workflow.dueDate || null,
        dependencies: step.dependsOn,
        conflictsWith: [],
        metadata: {
          workflowId: workflow.id,
          executionId,
          stepId: step.id,
          requiresApproval: step.requiresApproval,
        },
      })

      // Mark step as pending
      execution.steps.set(step.id, 'pending')

      // Assign task to agent
      const queuedTasks = taskQueue.getTasksByStatus('queued')
      const lastTask = queuedTasks[queuedTasks.length - 1]
      if (lastTask) {
        taskQueue.assignTask(lastTask.id, agentId)
        taskQueue.updateTaskStatus(lastTask.id, 'assigned')
      }

      // If step requires approval, add to pending approvals
      if (step.requiresApproval) {
        execution.approvalsPending.push(step.id)
        execution.status = 'awaiting_approval'

        logActivity(
          executionId,
          null,
          'Approval required',
          `Step ${step.title} requires human approval`,
          step.id
        )
      }
    }
  }

  function getWorkflowStatus(workflowId: string): WorkflowExecution | null {
    for (const execution of executions.values()) {
      if (execution.workflowId === workflowId) {
        return execution
      }
    }
    return null
  }

  function approveStep(executionId: string, stepId: string): boolean {
    const execution = executions.get(executionId)
    if (!execution) return false

    if (!execution.approvalsPending.includes(stepId)) {
      return false
    }

    execution.approvalsPending = execution.approvalsPending.filter((id) => id !== stepId)
    execution.steps.set(stepId, 'in_progress')

    logActivity(
      executionId,
      null,
      'Step approved',
      `Step ${stepId} has been approved and will proceed`,
      stepId
    )

    // Check if all approvals are done
    if (execution.approvalsPending.length === 0) {
      execution.status = 'in_progress'
    }

    return true
  }

  function rejectStep(executionId: string, stepId: string): boolean {
    const execution = executions.get(executionId)
    if (!execution) return false

    execution.approvalsPending = execution.approvalsPending.filter((id) => id !== stepId)
    execution.steps.set(stepId, 'failed')

    logActivity(
      executionId,
      null,
      'Step rejected',
      `Step ${stepId} has been rejected`,
      stepId
    )

    // Mark workflow as failed if critical step was rejected
    execution.status = 'failed'
    execution.completedAt = Date.now()

    return true
  }

  function reviseStep(executionId: string, stepId: string): boolean {
    const execution = executions.get(executionId)
    if (!execution) return false

    execution.steps.set(stepId, 'pending')
    execution.approvalsPending.push(stepId)
    execution.status = 'awaiting_approval'

    logActivity(
      executionId,
      null,
      'Step revision requested',
      `Step ${stepId} needs to be revised`,
      stepId
    )

    return true
  }

  function getActivities(executionId: string): WorkflowActivity[] {
    const execution = executions.get(executionId)
    return execution ? [...execution.activities] : []
  }

  function getMetrics(): OrchestratorMetrics {
    const allExecutions = Array.from(executions.values())
    const activeExecutions = allExecutions.filter(
      (e) => e.status === 'in_progress' || e.status === 'awaiting_approval'
    )
    const completedExecutions = allExecutions.filter((e) => e.status === 'completed')
    const failedExecutions = allExecutions.filter((e) => e.status === 'failed')

    const executionTimes = completedExecutions.map(
      (e) => (e.completedAt || Date.now()) - e.startedAt
    )
    const averageExecutionTimeMs =
      executionTimes.length > 0
        ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
        : 0

    const successRate =
      allExecutions.length > 0
        ? (completedExecutions.length / allExecutions.length) * 100
        : 0

    const agentUtilization: Record<AgentId, number> = {} as Record<AgentId, number>
    for (const agentId of agentIds) {
      const agentTasks = taskQueue.getTasksByAgent(agentId)
      const inProgressTasks = agentTasks.filter((t) => t.status === 'in_progress').length
      const maxConcurrent = AGENT_CAPABILITIES[agentId].maxConcurrentTasks
      agentUtilization[agentId] = maxConcurrent > 0 ? (inProgressTasks / maxConcurrent) * 100 : 0
    }

    return {
      totalWorkflows: allExecutions.length,
      activeWorkflows: activeExecutions.length,
      completedWorkflows: completedExecutions.length,
      failedWorkflows: failedExecutions.length,
      averageExecutionTimeMs: Math.round(averageExecutionTimeMs),
      successRate: Math.round(successRate * 100) / 100,
      agentUtilization,
    }
  }

  return {
    submitWorkflow,
    getWorkflowStatus,
    approveStep,
    rejectStep,
    reviseStep,
    getActivities,
    getMetrics,
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Topological sort of workflow steps by dependencies
 */
function topologicalSort(steps: WorkflowStep[]): WorkflowStep[] {
  const visited = new Set<string>()
  const result: WorkflowStep[] = []

  function visit(step: WorkflowStep, path: Set<string>): void {
    if (visited.has(step.id)) return

    if (path.has(step.id)) {
      throw new Error(`Circular dependency detected in step: ${step.id}`)
    }

    path.add(step.id)

    for (const depId of step.dependsOn) {
      const depStep = steps.find((s) => s.id === depId)
      if (depStep) {
        visit(depStep, path)
      }
    }

    visited.add(step.id)
    result.push(step)
    path.delete(step.id)
  }

  for (const step of steps) {
    visit(step, new Set())
  }

  return result
}
