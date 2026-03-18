import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getApprovals, createApproval } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      const status = req.query.status as string | undefined
      let approvals = getApprovals()

      if (status) {
        approvals = approvals.filter((a) => a.status === status)
      }

      return res.status(200).json(approvals)
    }

    if (req.method === 'POST') {
      const { agent_id, agent_name, category, title, description, content, priority, metadata } = req.body

      if (!agent_id || !category || !title) {
        return res.status(400).json({ error: 'Missing required fields: agent_id, category, title' })
      }

      const approval = createApproval({
        agent_id,
        agent_name: agent_name || '',
        category,
        title,
        description: description || '',
        content: content || '',
        status: 'pending',
        priority: priority || 'p2',
        reviewed_at: null,
        reviewer_notes: '',
        metadata: metadata || {},
      })

      return res.status(201).json(approval)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
