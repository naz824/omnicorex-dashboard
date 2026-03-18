import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { isDbConnected } from './_lib/db'

const startTime = Date.now()

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime_ms: Date.now() - startTime,
        database: isDbConnected() ? 'connected' : 'using_mock_data',
        version: '1.0.0',
        environment: process.env.VERCEL_ENV || 'development',
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
