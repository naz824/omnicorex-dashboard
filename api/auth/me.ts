import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
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
