// ============================================================================
// Agent Capability System — OmnicoreX Architecture
// ============================================================================
// Defines the 8 OmnicoreX agents with their roles, capabilities, tools, and routing logic
// Based on CrewAI, LangGraph, and XState architectural patterns

import type { Task } from './task-queue'

// ============================================================================
// Type Definitions
// ============================================================================

export type AgentId = 'apex' | 'nova' | 'meridian' | 'prism' | 'vertex' | 'nexus' | 'sentinel' | 'compass'

export type AgentCapabilityTag =
  | 'workflow_planning'
  | 'task_coordination'
  | 'priority_management'
  | 'agent_delegation'
  | 'lead_scoring'
  | 'outreach'
  | 'proposal_writing'
  | 'follow_up'
  | 'crm_management'
  | 'seo'
  | 'content_creation'
  | 'social_media'
  | 'competitor_analysis'
  | 'campaign_management'
  | 'ui_design'
  | 'branding'
  | 'mockup_creation'
  | 'asset_generation'
  | 'react_development'
  | 'responsive_design'
  | 'performance_optimization'
  | 'api_development'
  | 'database_design'
  | 'integration'
  | 'deployment'
  | 'testing'
  | 'bug_detection'
  | 'accessibility_audit'
  | 'performance_audit'
  | 'onboarding'
  | 'project_management'
  | 'scheduling'
  | 'client_communication'

export interface AgentCapability {
  id: AgentId
  name: string
  codeName: string
  role: string
  description: string
  capabilities: AgentCapabilityTag[]
  tools: string[]
  model: string
  maxConcurrentTasks: number
  specializations: string[]
}

export interface AgentConfig extends AgentCapability {
  avatarColor: string
  avatarInitials: string
}

export interface RoutingDecision {
  agentId: AgentId
  confidence: number
  reason: string
}

export interface ToolDefinition {
  name: string
  description: string
  requiredFor: AgentCapabilityTag[]
}

// ============================================================================
// Agent Capabilities Registry
// ============================================================================

export const AGENT_CAPABILITIES: Record<AgentId, AgentCapability> = {
  apex: {
    id: 'apex',
    name: 'Orchestrator',
    codeName: 'Apex',
    role: 'Lead Coordinator & Workflow Orchestrator',
    description: 'Meta-agent that coordinates workflow across all agents, handles task decomposition, prioritization, and delegation',
    capabilities: [
      'workflow_planning',
      'task_coordination',
      'priority_management',
      'agent_delegation',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'web_search',
      'web_fetch',
      'bash',
      'workflow_orchestration',
      'task_decomposition',
      'priority_queue',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 10,
    specializations: [
      'workflow architecture',
      'task decomposition',
      'dependency management',
      'resource allocation',
    ],
  },

  nova: {
    id: 'nova',
    name: 'Sales Agent',
    codeName: 'Nova',
    role: 'Senior Sales Strategist',
    description: 'Handles lead scoring, outreach, proposal generation, follow-up sequences, and CRM management',
    capabilities: [
      'lead_scoring',
      'outreach',
      'proposal_writing',
      'follow_up',
      'crm_management',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'web_search',
      'web_fetch',
      'crm_api',
      'email_generation',
      'lead_scoring_engine',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 5,
    specializations: [
      'lead qualification',
      'sales copywriting',
      'objection handling',
      'deal progression',
      'pipeline management',
    ],
  },

  meridian: {
    id: 'meridian',
    name: 'Marketing Agent',
    codeName: 'Meridian',
    role: 'Digital Marketing Strategist',
    description: 'Manages SEO, content creation, social media strategy, competitor analysis, and marketing campaigns',
    capabilities: [
      'seo',
      'content_creation',
      'social_media',
      'competitor_analysis',
      'campaign_management',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'web_search',
      'web_fetch',
      'seo_analyzer',
      'content_generator',
      'social_media_api',
      'analytics_engine',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 4,
    specializations: [
      'SEO optimization',
      'content strategy',
      'social media management',
      'competitive intelligence',
      'campaign analytics',
    ],
  },

  prism: {
    id: 'prism',
    name: 'Design Agent',
    codeName: 'Prism',
    role: 'Senior UX/UI Designer',
    description: 'Creates UI designs, brand guidelines, mockups, and marketing assets',
    capabilities: [
      'ui_design',
      'branding',
      'mockup_creation',
      'asset_generation',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'design_system',
      'mockup_generator',
      'asset_generator',
      'brand_engine',
      'figma_api',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 3,
    specializations: [
      'UI/UX design',
      'brand identity',
      'design systems',
      'user research',
      'accessibility design',
    ],
  },

  vertex: {
    id: 'vertex',
    name: 'Frontend Agent',
    codeName: 'Vertex',
    role: 'Senior Frontend Engineer',
    description: 'Handles React development, responsive design, performance optimization, and frontend architecture',
    capabilities: [
      'react_development',
      'responsive_design',
      'performance_optimization',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'bash',
      'react_compiler',
      'bundler',
      'performance_profiler',
      'accessibility_checker',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 3,
    specializations: [
      'React patterns',
      'responsive UI',
      'performance tuning',
      'accessibility compliance',
      'frontend architecture',
    ],
  },

  nexus: {
    id: 'nexus',
    name: 'Backend Agent',
    codeName: 'Nexus',
    role: 'Senior Backend Engineer',
    description: 'Manages API development, database design, system integration, and deployment',
    capabilities: [
      'api_development',
      'database_design',
      'integration',
      'deployment',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'bash',
      'database_tools',
      'api_framework',
      'deployment_cli',
      'monitoring_tools',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 3,
    specializations: [
      'API design',
      'database architecture',
      'system integration',
      'DevOps',
      'monitoring & logging',
    ],
  },

  sentinel: {
    id: 'sentinel',
    name: 'QA Agent',
    codeName: 'Sentinel',
    role: 'Senior QA Engineer',
    description: 'Performs testing, bug detection, accessibility audits, and performance testing',
    capabilities: [
      'testing',
      'bug_detection',
      'accessibility_audit',
      'performance_audit',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'bash',
      'test_framework',
      'accessibility_scanner',
      'performance_tester',
      'bug_reporter',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 4,
    specializations: [
      'test automation',
      'accessibility testing',
      'performance testing',
      'security testing',
      'regression testing',
    ],
  },

  compass: {
    id: 'compass',
    name: 'Operations Agent',
    codeName: 'Compass',
    role: 'Senior Operations Manager',
    description: 'Handles project onboarding, project management, scheduling, and client communication',
    capabilities: [
      'onboarding',
      'project_management',
      'scheduling',
      'client_communication',
    ],
    tools: [
      'read',
      'write',
      'edit',
      'glob',
      'grep',
      'web_search',
      'web_fetch',
      'project_management_api',
      'calendar_api',
      'email_client',
      'document_generator',
    ],
    model: 'sonnet',
    maxConcurrentTasks: 5,
    specializations: [
      'project coordination',
      'client management',
      'schedule optimization',
      'resource planning',
      'stakeholder communication',
    ],
  },
}

// ============================================================================
// Tool Registry
// ============================================================================

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  read: {
    name: 'Read',
    description: 'Read and analyze file contents',
    requiredFor: ['lead_scoring', 'proposal_writing', 'ui_design', 'react_development', 'api_development', 'testing'],
  },
  write: {
    name: 'Write',
    description: 'Create and write files',
    requiredFor: ['proposal_writing', 'content_creation', 'asset_generation', 'react_development', 'api_development'],
  },
  edit: {
    name: 'Edit',
    description: 'Edit existing files',
    requiredFor: ['proposal_writing', 'content_creation', 'react_development', 'api_development'],
  },
  web_search: {
    name: 'Web Search',
    description: 'Search the web for information',
    requiredFor: ['seo', 'competitor_analysis', 'lead_scoring', 'content_creation'],
  },
  crm_api: {
    name: 'CRM API',
    description: 'Interface with CRM systems',
    requiredFor: ['crm_management', 'lead_scoring', 'outreach'],
  },
  seo_analyzer: {
    name: 'SEO Analyzer',
    description: 'Analyze SEO metrics and recommendations',
    requiredFor: ['seo', 'competitor_analysis'],
  },
  design_system: {
    name: 'Design System',
    description: 'Access design system components',
    requiredFor: ['ui_design', 'branding', 'mockup_creation'],
  },
  react_compiler: {
    name: 'React Compiler',
    description: 'Compile and validate React code',
    requiredFor: ['react_development', 'performance_optimization'],
  },
  api_framework: {
    name: 'API Framework',
    description: 'API development and validation',
    requiredFor: ['api_development', 'integration'],
  },
  test_framework: {
    name: 'Test Framework',
    description: 'Run and manage tests',
    requiredFor: ['testing', 'bug_detection'],
  },
  workflow_orchestration: {
    name: 'Workflow Orchestration',
    description: 'Manage workflow execution and dependencies',
    requiredFor: ['workflow_planning', 'task_coordination', 'agent_delegation'],
  },
}

// ============================================================================
// Routing Logic
// ============================================================================

/**
 * Routes a task to the most appropriate agent based on required capabilities
 * Uses a scoring system to determine the best match
 */
export function routeTaskByCapability(task: Task): RoutingDecision {
  const taskCapabilities = task.requiredCapabilities || []

  if (taskCapabilities.length === 0) {
    return {
      agentId: 'apex',
      confidence: 0.5,
      reason: 'No specific capabilities required, defaulting to Apex orchestration',
    }
  }

  let bestMatch: RoutingDecision | null = null

  for (const [agentId, capability] of Object.entries(AGENT_CAPABILITIES)) {
    const matchingCapabilities = taskCapabilities.filter((cap) =>
      capability.capabilities.includes(cap as AgentCapabilityTag)
    )

    const matchScore = matchingCapabilities.length / taskCapabilities.length
    const availabilityMultiplier = capability.maxConcurrentTasks > 0 ? 1 : 0.5

    const confidence = matchScore * availabilityMultiplier

    if (!bestMatch || confidence > bestMatch.confidence) {
      bestMatch = {
        agentId: agentId as AgentId,
        confidence,
        reason: `Matched ${matchingCapabilities.length}/${taskCapabilities.length} required capabilities`,
      }
    }
  }

  return (
    bestMatch || {
      agentId: 'apex',
      confidence: 0,
      reason: 'No matching agent found, escalating to Apex',
    }
  )
}

/**
 * Get the tools available to a specific agent
 */
export function getAgentTools(agentId: AgentId): string[] {
  const agent = AGENT_CAPABILITIES[agentId]
  return agent ? agent.tools : []
}

/**
 * Get the system prompt for a specific agent
 * This prompt defines the agent's personality, constraints, and operational guidelines
 */
export function getAgentSystemPrompt(agentId: AgentId): string {
  const agent = AGENT_CAPABILITIES[agentId]
  if (!agent) {
    return 'You are an OmnicoreX agent. Follow all instructions carefully.'
  }

  const basePrompt = `You are ${agent.name} (${agent.codeName}), the ${agent.role} for OmnicoreX.

## Your Role
${agent.description}

## Your Capabilities
You are an expert in: ${agent.specializations.join(', ')}.

## Your Responsibilities
1. Execute tasks within your domain of expertise
2. Collaborate with other agents via the workflow orchestration system
3. Request human approval for critical decisions
4. Provide detailed reasoning for your actions
5. Log all activities for audit trails
6. Escalate to Apex if task falls outside your capabilities
7. Communicate clearly with stakeholders about progress and blockers

## Constraints
- Do not exceed your max concurrent tasks (${agent.maxConcurrentTasks})
- Prioritize high-urgency work (P1 > P2 > P3 > P4)
- Always get human approval for: legal commitments, financial decisions, scope changes
- Never override safety guidelines
- Maintain professional tone in all client communications

## Tools Available
You have access to: ${agent.tools.join(', ')}.

## Communication Style
- Be professional and clear
- Explain your reasoning step-by-step
- Highlight any risks or blockers immediately
- Use structured formats for complex information`

  return basePrompt
}

/**
 * Get agent configuration including visual properties
 */
export function getAgentConfig(agentId: AgentId): AgentConfig | null {
  const capability = AGENT_CAPABILITIES[agentId]
  if (!capability) return null

  const colorMap: Record<AgentId, string> = {
    apex: 'from-white to-slate-300',
    nova: 'from-blue-400 to-blue-600',
    meridian: 'from-emerald-400 to-emerald-600',
    prism: 'from-purple-400 to-purple-600',
    vertex: 'from-cyan-400 to-cyan-600',
    nexus: 'from-orange-400 to-orange-600',
    sentinel: 'from-rose-400 to-rose-600',
    compass: 'from-amber-400 to-amber-600',
  }

  const initialsMap: Record<AgentId, string> = {
    apex: 'AO',
    nova: 'NS',
    meridian: 'MK',
    prism: 'PD',
    vertex: 'VF',
    nexus: 'NB',
    sentinel: 'SQ',
    compass: 'CO',
  }

  return {
    ...capability,
    avatarColor: colorMap[agentId],
    avatarInitials: initialsMap[agentId],
  }
}

/**
 * Check if an agent has a specific capability
 */
export function agentHasCapability(agentId: AgentId, capability: AgentCapabilityTag): boolean {
  const agent = AGENT_CAPABILITIES[agentId]
  return agent ? agent.capabilities.includes(capability) : false
}

/**
 * Find agents capable of handling a specific capability
 */
export function findAgentsByCapability(capability: AgentCapabilityTag): AgentId[] {
  return Object.entries(AGENT_CAPABILITIES)
    .filter(([_id, agent]) => agent.capabilities.includes(capability))
    .map(([id]) => id as AgentId)
}

/**
 * Get a summary of all agent capabilities
 */
export function getCapabilitiesSummary(): Record<AgentCapabilityTag, AgentId[]> {
  const summary: Record<AgentCapabilityTag, AgentId[]> = {} as Record<AgentCapabilityTag, AgentId[]>

  const allCapabilities = new Set<AgentCapabilityTag>()
  for (const agent of Object.values(AGENT_CAPABILITIES)) {
    agent.capabilities.forEach((cap) => allCapabilities.add(cap))
  }

  for (const capability of allCapabilities) {
    summary[capability] = findAgentsByCapability(capability)
  }

  return summary
}
