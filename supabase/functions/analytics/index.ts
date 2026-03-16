// Supabase Edge Function: analytics
// Returns aggregated analytics data from PostgreSQL functions

import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

interface AnalyticsResponse {
  success: boolean
  message: string
  dashboard_stats?: Record<string, unknown>
  pipeline_summary?: Record<string, unknown>
  revenue_summary?: Record<string, unknown>
  error?: string
}

// Helper to parse period parameter
function parsePeriod(period: string): number {
  const periodMap: Record<string, number> = {
    '30d': 30,
    '90d': 90,
    '6m': 180,
    '1y': 365,
  }
  return periodMap[period] || 30 // Default to 30 days
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Only accept GET
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      )
    }

    // Parse query parameters
    const url = new URL(req.url)
    const period = url.searchParams.get('period') || '30d'

    const supabase = createSupabaseClient()

    // Call PostgreSQL function: get_dashboard_stats
    const { data: dashboardStats, error: statsError } = await supabase.rpc(
      'get_dashboard_stats'
    )

    if (statsError) {
      console.error('Failed to get dashboard stats:', statsError)
    }

    // Call PostgreSQL function: get_pipeline_summary
    const days = parsePeriod(period)
    const { data: pipelineSummary, error: pipelineError } = await supabase.rpc(
      'get_pipeline_summary',
      { p_days: days }
    )

    if (pipelineError) {
      console.error('Failed to get pipeline summary:', pipelineError)
    }

    // Call PostgreSQL function: get_revenue_summary
    const { data: revenueSummary, error: revenueError } = await supabase.rpc(
      'get_revenue_summary',
      { p_days: days }
    )

    if (revenueError) {
      console.error('Failed to get revenue summary:', revenueError)
    }

    const response: AnalyticsResponse = {
      success: true,
      message: 'Analytics data retrieved successfully',
      dashboard_stats: dashboardStats,
      pipeline_summary: pipelineSummary,
      revenue_summary: revenueSummary,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Analytics error:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
