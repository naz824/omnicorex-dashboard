import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getAgents } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      const agents = getAgents()
      return res.status(200).json(agents)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
