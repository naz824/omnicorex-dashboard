import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { createLead, createActivity, createBooking } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'POST') {
      const { name, email, phone, business_name, website_url, industry, location, notes, source, goal, preferred_date, preferred_time } = req.body

      if (!name || !email || !business_name) {
        return res.status(400).json({ error: 'Missing required fields: name, email, business_name' })
      }

      // Create lead
      const lead = createLead({
        name,
        email,
        phone: phone || '',
        business_name,
        website_url: website_url || '',
        industry: industry || '',
        location: location || '',
        status: 'new',
        source: source || 'website',
        score: 50,
        budget_range: '',
        urgency: 'Exploring options',
        notes: notes || '',
        assigned_agent: 'Nova',
        next_follow_up: null,
      })

      // Create activity
      createActivity({
        agent_name: 'System',
        action: 'Created lead from form submission',
        description: `New lead: ${business_name} (${email})`,
        entity_type: 'lead',
        entity_id: lead.id,
        timestamp: new Date().toISOString(),
      })

      // Create booking if date/time provided
      if (preferred_date) {
        createBooking({
          lead_id: lead.id,
          name,
          email,
          phone: phone || '',
          business_name,
          website_url: website_url || '',
          goal: goal || 'Website inquiry',
          preferred_date,
          preferred_time: preferred_time || '',
          status: 'pending',
          notes: `Form submission - ${notes || 'No additional notes'}`,
          meeting_link: null,
        })
      }

      return res.status(201).json({
        success: true,
        lead,
        message: 'Thank you for your inquiry! We will be in touch shortly.',
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
