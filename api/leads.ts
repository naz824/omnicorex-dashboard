import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { getLeads, getLead, createLead, updateLead, deleteLead } from './_lib/mock-data.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    const id = req.query.id as string | undefined

    if (req.method === 'GET') {
      // Single lead by ID
      if (id) {
        const lead = getLead(id)
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found' })
        }
        return res.status(200).json(lead)
      }

      // List leads
      const status = req.query.status as string | undefined
      let leads = getLeads()

      if (status) {
        leads = leads.filter((l) => l.status === status)
      }

      return res.status(200).json(leads)
    }

    if (req.method === 'POST') {
      const { name, email, phone, business_name, website_url, industry, location, status, source, score, budget_range, urgency, notes, assigned_agent } = req.body

      if (!name || !email || !business_name) {
        return res.status(400).json({ error: 'Missing required fields: name, email, business_name' })
      }

      const lead = createLead({
        name,
        email,
        phone: phone || '',
        business_name,
        website_url: website_url || '',
        industry: industry || '',
        location: location || '',
        status: status || 'new',
        source: source || 'other',
        score: score || 0,
        budget_range: budget_range || '',
        urgency: urgency || '',
        notes: notes || '',
        assigned_agent: assigned_agent || 'Nova',
        next_follow_up: null,
      })

      return res.status(201).json(lead)
    }

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ error: 'Missing lead ID' })
      }

      const lead = updateLead(id, req.body)
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' })
      }
      return res.status(200).json(lead)
    }

    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Missing lead ID' })
      }

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
