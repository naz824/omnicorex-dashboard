import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { getProjects, getProject, createProject, updateProject, deleteProject } from './_lib/mock-data.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    const id = req.query.id as string | undefined

    if (req.method === 'GET') {
      // Single project by ID
      if (id) {
        const project = getProject(id)
        if (!project) {
          return res.status(404).json({ error: 'Project not found' })
        }
        return res.status(200).json(project)
      }

      // List projects
      const status = req.query.status as string | undefined
      let projects = getProjects()

      if (status) {
        projects = projects.filter((p) => p.status === status)
      }

      return res.status(200).json(projects)
    }

    if (req.method === 'POST') {
      const { lead_id, name, client_name, client_email, status, package_tier, budget, start_date, estimated_end_date, progress, current_phase, notes } = req.body

      if (!lead_id || !name || !client_name) {
        return res.status(400).json({ error: 'Missing required fields: lead_id, name, client_name' })
      }

      const project = createProject({
        lead_id,
        name,
        client_name,
        client_email: client_email || '',
        status: status || 'discovery',
        package_tier: package_tier || 'starter',
        budget: budget || 0,
        start_date: start_date || new Date().toISOString().split('T')[0],
        estimated_end_date: estimated_end_date || '',
        actual_end_date: null,
        progress: progress || 0,
        current_phase: current_phase || '',
        notes: notes || '',
      })

      return res.status(201).json(project)
    }

    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ error: 'Missing project ID' })
      }

      const project = updateProject(id, req.body)
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      return res.status(200).json(project)
    }

    if (req.method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ error: 'Missing project ID' })
      }

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
