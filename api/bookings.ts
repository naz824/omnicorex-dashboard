import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getBookings, createBooking } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      const status = req.query.status as string | undefined
      let bookings = getBookings()

      if (status) {
        bookings = bookings.filter((b) => b.status === status)
      }

      return res.status(200).json(bookings)
    }

    if (req.method === 'POST') {
      const { lead_id, name, email, phone, business_name, website_url, goal, preferred_date, preferred_time, status, notes } = req.body

      if (!name || !email) {
        return res.status(400).json({ error: 'Missing required fields: name, email' })
      }

      const booking = createBooking({
        lead_id: lead_id || null,
        name,
        email,
        phone: phone || '',
        business_name: business_name || '',
        website_url: website_url || '',
        goal: goal || '',
        preferred_date: preferred_date || '',
        preferred_time: preferred_time || '',
        status: status || 'pending',
        notes: notes || '',
        meeting_link: null,
      })

      return res.status(201).json(booking)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
