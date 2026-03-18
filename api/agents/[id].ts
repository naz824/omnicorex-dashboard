import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { getAgent, updateAgent, createActivity } from '../_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing agent ID' })
  }

  try {
    if (req.method === 'GET') {
      const agent = getAgent(id)
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' })
      }
      return res.status(200).json(agent)
    }

    if (req.method === 'PUT') {
      const agent = updateAgent(id, req.body)
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' })
      }
      return res.status(200).json(agent)
    }

    if (req.method === 'POST') {
      // Agent actions: run_task, pause, resume
      const { action, entity_type, entity_id, payload } = req.body

      const agent = getAgent(id)
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' })
      }

      let result = {}

      if (action === 'run_task') {
        const updated = updateAgent(id, {
          status: 'working',
          current_task: payload?.task_name || 'Running task',
          tasks_completed_today: agent.tasks_completed_today,
          last_active: new Date().toISOString(),
        })

        createActivity({
          agent_name: agent.name,
          action: 'Started task',
          description: `${agent.name} started executing task: ${payload?.task_name || 'Task'}`,
          entity_type: entity_type || 'system',
          entity_id: entity_id || null,
          timestamp: new Date().toISOString(),
        })

        result = { success: true, task_id: `task-${Date.now()}`, agent: updated }
      } else if (action === 'pause') {
        const updated = updateAgent(id, {
          status: 'idle',
          last_active: new Date().toISOString(),
        })

        result = { success: true, agent: updated }
      } else if (action === 'resume') {
        const updated = updateAgent(id, {
          status: 'working',
          last_active: new Date().toISOString(),
        })

        result = { success: true, agent: updated }
      } else {
        return res.status(400).json({ error: 'Invalid action' })
      }

      return res.status(200).json(result)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
