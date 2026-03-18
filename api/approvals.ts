import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { getApprovals, getApproval, createApproval, updateApproval } from './_lib/mock-data.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    const id = req.query.id as string | undefined

    if (req.method === 'GET') {
      // Single approval by ID
      if (id) {
        const approval = getApproval(id)
        if (!approval) {
          return res.status(404).json({ error: 'Approval not found' })
        }
        return res.status(200).json(approval)
      }

      // List approvals
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

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ error: 'Missing approval ID' })
      }

      const { action, reviewer_notes } = req.body

      const approval = getApproval(id)
      if (!approval) {
        return res.status(404).json({ error: 'Approval not found' })
      }

      let status = approval.status
      if (action === 'approve') {
        status = 'approved'
      } else if (action === 'reject') {
        status = 'rejected'
      } else if (action === 'request_revision') {
        status = 'revision_requested'
      } else if (!action) {
        // Update without action (general update)
      } else {
        return res.status(400).json({ error: 'Invalid action' })
      }

      const updated = updateApproval(id, {
        status,
        reviewed_at: action ? new Date().toISOString() : approval.reviewed_at,
        reviewer_notes: reviewer_notes || approval.reviewer_notes,
      })

      return res.status(200).json(updated)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
