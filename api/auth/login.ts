import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { randomUUID } from 'node:crypto'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'POST') {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' })
      }

      // Mock authentication - accept nasir@omnicorex.com with any password
      if (email === 'nasir@omnicorex.com') {
        const token = randomUUID()
        return res.status(200).json({
          token,
          user: {
            id: 'user-1',
            email,
            name: 'Nasir Chase',
            role: 'admin',
          },
        })
      }

      return res.status(401).json({ error: 'Invalid credentials' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
