import type { VercelRequest, VercelResponse } from '@vercel/node'

const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:3000', 'https://omnicorex-dashboard.vercel.app']

export const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version,Authorization',
}

export function cors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || ''
  const isAllowed = ALLOWED_ORIGINS.some((allowed) => origin.includes(allowed) || ALLOWED_ORIGINS.includes(origin))

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }

  return false
}
