import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { randomUUID } from 'node:crypto'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'POST') {
      const { email, password, name } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' })
      }

      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // Mock signup - create user
      const token = randomUUID()
      const userId = randomUUID()

      return res.status(201).json({
        token,
        user: {
          id: userId,
          email,
          name: name || email.split('@')[0],
          role: 'user',
        },
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
