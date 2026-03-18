import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getActivities, createActivity } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50
      const activities = getActivities(Math.max(1, Math.min(limit, 100)))
      return res.status(200).json(activities)
    }

    if (req.method === 'POST') {
      const { agent_name, action, description, entity_type, entity_id } = req.body

      if (!agent_name || !action) {
        return res.status(400).json({ error: 'Missing required fields: agent_name, action' })
      }

      const activity = createActivity({
        agent_name,
        action,
        description: description || '',
        entity_type: entity_type || 'system',
        entity_id: entity_id || null,
        timestamp: new Date().toISOString(),
      })

      return res.status(201).json(activity)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
