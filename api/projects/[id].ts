import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { getProject, updateProject, deleteProject } from '../_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing project ID' })
  }

  try {
    if (req.method === 'GET') {
      const project = getProject(id)
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      return res.status(200).json(project)
    }

    if (req.method === 'PUT') {
      const project = updateProject(id, req.body)
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      return res.status(200).json(project)
    }

    if (req.method === 'DELETE') {
      const deleted = deleteProject(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found' })
      }
      return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
