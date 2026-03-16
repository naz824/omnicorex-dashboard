// Supabase Edge Function: approve-action
// Handles human-in-the-loop approval workflow

import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

interface ApprovalRequest {
  approval_id: string
  action: 'approve' | 'reject' | 'revision'
  reviewer_notes: string
}

interface ApprovalResponse {
  success: boolean
  message: string
  approval?: Record<string, unknown>
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

    const approvalRequest: ApprovalRequest = await req.json()

    // Validate required fields
    if (!approvalRequest.approval_id || !approvalRequest.action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: approval_id, action' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate action
    if (!['approve', 'reject', 'revision'].includes(approvalRequest.action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be: approve, reject, or revision' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createSupabaseClient()

    // Get the approval record
    const { data: approval, error: fetchError } = await supabase
      .from('approvals')
      .select('*')
      .eq('id', approvalRequest.approval_id)
      .single()

    if (fetchError || !approval) {
      return new Response(
        JSON.stringify({ error: 'Approval not found' }),
        { status: 404, headers: corsHeaders }
      )
    }

    // Map action to approval status
    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      revision: 'revision_requested',
    }

    // Update approval status
    const { data: updatedApproval, error: updateError } = await supabase
      .from('approvals')
      .update({
        status: statusMap[approvalRequest.action],
        reviewed_at: new Date().toISOString(),
        reviewer_notes: approvalRequest.reviewer_notes || '',
      })
      .eq('id', approvalRequest.approval_id)
      .select()
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update approval' }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Log the approval activity
    const { error: logError } = await supabase.from('activities').insert({
      id: crypto.randomUUID(),
      agent_name: 'System',
      action: `Approval ${approvalRequest.action}ed`,
      description: `${approval.agent_name}'s ${approval.category} approval was ${approvalRequest.action}ed: "${approval.title}"`,
      entity_type: 'approval',
      entity_id: approvalRequest.approval_id,
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.error('Failed to log approval activity:', logError)
    }

    // If approved, handle post-approval logic
    if (approvalRequest.action === 'approve') {
      // Update related entity based on metadata
      if (approval.metadata?.lead_id) {
        // For lead-related approvals
        const { error: leadError } = await supabase
          .from('leads')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', approval.metadata.lead_id)

        if (leadError) {
          console.error('Failed to update related lead:', leadError)
        }
      }

      if (approval.metadata?.project_id) {
        // For project-related approvals
        const { error: projectError } = await supabase
          .from('projects')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', approval.metadata.project_id)

        if (projectError) {
          console.error('Failed to update related project:', projectError)
        }
      }
    }

    const response: ApprovalResponse = {
      success: true,
      message: `Approval ${approvalRequest.action}ed successfully`,
      approval: updatedApproval,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Approval processing error:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
