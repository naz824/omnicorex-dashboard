import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { getBooking, updateBooking, deleteBooking } from '../_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing booking ID' })
  }

  try {
    if (req.method === 'GET') {
      const booking = getBooking(id)
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      return res.status(200).json(booking)
    }

    if (req.method === 'PUT') {
      const booking = updateBooking(id, req.body)
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      return res.status(200).json(booking)
    }

    if (req.method === 'DELETE') {
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
