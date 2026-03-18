import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { getLead, updateLead, deleteLead } from '../_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing lead ID' })
  }

  try {
    if (req.method === 'GET') {
      const lead = getLead(id)
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' })
      }
      return res.status(200).json(lead)
    }

    if (req.method === 'PUT') {
      const lead = updateLead(id, req.body)
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' })
      }
      return res.status(200).json(lead)
    }

    if (req.method === 'DELETE') {
      const deleted = deleteLead(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Lead not found' })
      }
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
