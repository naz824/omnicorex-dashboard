import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { getApproval, updateApproval } from '../_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing approval ID' })
  }

  try {
    if (req.method === 'GET') {
      const approval = getApproval(id)
      if (!approval) {
        return res.status(404).json({ error: 'Approval not found' })
      }
      return res.status(200).json(approval)
    }

    if (req.method === 'PUT') {
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
