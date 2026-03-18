import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getAgent, createActivity, getLead, getProject } from './_lib/mock-data'
import { randomUUID } from 'node:crypto'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'POST') {
      const { agent_id, action, entity_type, entity_id, payload } = req.body

      if (!agent_id || !action) {
        return res.status(400).json({ error: 'Missing required fields: agent_id, action' })
      }

      const agent = getAgent(agent_id)
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' })
      }

      const taskId = randomUUID()
      const startTime = Date.now()

      // Determine entity context
      let entityName = ''
      if (entity_type === 'lead' && entity_id) {
        const lead = getLead(entity_id)
        entityName = lead ? lead.business_name : entity_id
      } else if (entity_type === 'project' && entity_id) {
        const project = getProject(entity_id)
        entityName = project ? project.name : entity_id
      }

      // Log the activity
      createActivity({
        agent_name: agent.name,
        action: `Executed task: ${action}`,
        description: `Agent ${agent.code_name} executed ${action} on ${entity_type} (${entityName})`,
        entity_type: entity_type || 'system',
        entity_id: entity_id || null,
        timestamp: new Date().toISOString(),
      })

      // Mock task execution result
      const executionTime = Math.random() * 3000 + 500 // 500ms - 3.5s

      return res.status(200).json({
        task_id: taskId,
        agent_id,
        agent_name: agent.name,
        action,
        entity_type,
        entity_id,
        status: 'success',
        execution_time_ms: Math.round(executionTime),
        result: {
          success: true,
          message: `Task ${action} completed successfully`,
          data: payload || {},
        },
        started_at: new Date(Date.now() - executionTime).toISOString(),
        completed_at: new Date().toISOString(),
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
