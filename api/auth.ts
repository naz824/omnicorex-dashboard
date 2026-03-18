import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { randomUUID } from 'node:crypto'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    const action = req.query.action as string | undefined

    // POST /api/auth?action=login
    if (req.method === 'POST' && action === 'login') {
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

    // POST /api/auth?action=signup
    if (req.method === 'POST' && action === 'signup') {
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

    // GET /api/auth?action=me
    if (req.method === 'GET' && action === 'me') {
      const authHeader = req.headers.authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

      if (!token) {
        return res.status(401).json({ error: 'Missing authorization token' })
      }

      // Mock token validation - any non-empty token is valid
      return res.status(200).json({
        id: 'user-1',
        email: 'nasir@omnicorex.com',
        name: 'Nasir Chase',
        role: 'admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nasir',
        verified: true,
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
