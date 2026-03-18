import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { getDashboardStats, getRevenue, getLeads, getProjects } from './_lib/mock-data'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  try {
    if (req.method === 'GET') {
      const stats = getDashboardStats()
      const revenue = getRevenue()
      const leads = getLeads()
      const projects = getProjects()

      // Calculate pipeline summary
      const pipelineByStatus: Record<string, number> = {}
      leads.forEach((lead) => {
        pipelineByStatus[lead.status] = (pipelineByStatus[lead.status] || 0) + 1
      })

      // Calculate revenue summary
      const totalRevenue = revenue.reduce((sum, m) => sum + m.revenue, 0)
      const avgDealSize = revenue.reduce((sum, m) => sum + m.avg_deal_size, 0) / revenue.length
      const totalDeals = revenue.reduce((sum, m) => sum + m.deals_closed, 0)

      const response = {
        dashboard_stats: stats,
        revenue_summary: {
          total_revenue: totalRevenue,
          monthly_revenue: stats.monthly_revenue,
          avg_deal_size: avgDealSize,
          total_deals_closed: totalDeals,
          ytd_revenue: totalRevenue,
        },
        pipeline_summary: {
          by_status: pipelineByStatus,
          total_pipeline_value: leads.reduce((sum, l) => {
            const budgetStr = l.budget_range.replace(/[^0-9]/g, '')
            const amount = parseInt(budgetStr) || 0
            return sum + amount
          }, 0),
          conversion_rate: stats.conversion_rate,
        },
        revenue_metrics: revenue,
        project_summary: {
          total_projects: projects.length,
          by_status: projects.reduce(
            (acc, p) => {
              acc[p.status] = (acc[p.status] || 0) + 1
              return acc
            },
            {} as Record<string, number>
          ),
          total_budget: projects.reduce((sum, p) => sum + p.budget, 0),
          avg_budget: projects.length > 0 ? projects.reduce((sum, p) => sum + p.budget, 0) / projects.length : 0,
        },
      }

      return res.status(200).json(response)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
