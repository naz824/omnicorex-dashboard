import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { getBookings, getBooking, createBooking, updateBooking, deleteBooking } from './_lib/mock-data.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    const id = req.query.id as string | undefined

    if (req.method === 'GET') {
      // Single booking by ID
      if (id) {
        const booking = getBooking(id)
        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' })
        }
        return res.status(200).json(booking)
      }

      // List bookings
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

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ error: 'Missing booking ID' })
      }

      const booking = updateBooking(id, req.body)
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      return res.status(200).json(booking)
    }

    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Missing booking ID' })
      }

      const deleted = deleteBooking(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
