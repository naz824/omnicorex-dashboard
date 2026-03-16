// Supabase Edge Function: agent-task
// Handles agent task execution, logging, and updates

import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

interface TaskRequest {
  agent_id: string
  action: string
  entity_type: 'lead' | 'project' | 'booking' | 'approval' | 'system'
  entity_id?: string
  payload?: Record<string, unknown>
}

interface TaskResponse {
  success: boolean
  message: string
  task_id?: string
  error?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Only accept POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      )
    }

    const taskRequest: TaskRequest = await req.json()

    // Validate required fields
    if (!taskRequest.agent_id || !taskRequest.action || !taskRequest.entity_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: agent_id, action, entity_type' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createSupabaseClient()

    // Verify agent exists and is not offline
    const { data: agent, error: agentError } = await supabase
      .from('agent_config')
      .select('id, name, status, tasks_completed_today, tasks_completed_total')
      .eq('id', taskRequest.agent_id)
      .single()

    if (agentError || !agent) {
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: corsHeaders }
      )
    }

    if (agent.status === 'offline') {
      return new Response(
        JSON.stringify({ error: 'Agent is offline' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Generate task ID
    const taskId = crypto.randomUUID()

    // Log the activity
    const { error: logError } = await supabase.from('activities').insert({
      id: crypto.randomUUID(),
      agent_name: agent.name,
      action: taskRequest.action,
      description: `${taskRequest.action} on ${taskRequest.entity_type}${taskRequest.entity_id ? ` #${taskRequest.entity_id}` : ''}`,
      entity_type: taskRequest.entity_type,
      entity_id: taskRequest.entity_id || null,
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.error('Failed to log activity:', logError)
    }

    // Update agent task counts
    const { error: updateError } = await supabase
      .from('agent_config')
      .update({
        tasks_completed_today: agent.tasks_completed_today + 1,
        tasks_completed_total: agent.tasks_completed_total + 1,
        last_active: new Date().toISOString(),
      })
      .eq('id', taskRequest.agent_id)

    if (updateError) {
      console.error('Failed to update agent task count:', updateError)
    }

    const response: TaskResponse = {
      success: true,
      message: `Task executed successfully for agent ${agent.name}`,
      task_id: taskId,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Task execution error:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
