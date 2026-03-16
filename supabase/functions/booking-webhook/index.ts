// Supabase Edge Function: booking-webhook
// Handles booking confirmations, cancellations, and completions

import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

interface BookingWebhookRequest {
  booking_id: string
  action: 'confirm' | 'cancel' | 'complete'
  notes?: string
}

interface BookingWebhookResponse {
  success: boolean
  message: string
  booking?: Record<string, unknown>
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

    const webhookRequest: BookingWebhookRequest = await req.json()

    // Validate required fields
    if (!webhookRequest.booking_id || !webhookRequest.action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: booking_id, action' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate action
    if (!['confirm', 'cancel', 'complete'].includes(webhookRequest.action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be: confirm, cancel, or complete' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createSupabaseClient()

    // Get the booking record
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', webhookRequest.booking_id)
      .single()

    if (fetchError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: corsHeaders }
      )
    }

    // Map action to booking status
    const statusMap: Record<string, string> = {
      confirm: 'confirmed',
      cancel: 'cancelled',
      complete: 'completed',
    }

    // Update booking status
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: statusMap[webhookRequest.action],
        updated_at: new Date().toISOString(),
      })
      .eq('id', webhookRequest.booking_id)
      .select()
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update booking' }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Log notification (for now, just log it)
    const notificationMessage = `Booking notification: ${webhookRequest.action} - ${booking.name} (${booking.business_name})`
    if (webhookRequest.notes) {
      console.log(`${notificationMessage}. Notes: ${webhookRequest.notes}`)
    } else {
      console.log(notificationMessage)
    }

    // Log the booking activity
    const { error: logError } = await supabase.from('activities').insert({
      id: crypto.randomUUID(),
      agent_name: 'System',
      action: `Booking ${webhookRequest.action}ed`,
      description: `Booking with ${booking.name} from ${booking.business_name} was ${statusMap[webhookRequest.action]}${webhookRequest.notes ? `: ${webhookRequest.notes}` : ''}`,
      entity_type: 'booking',
      entity_id: webhookRequest.booking_id,
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.error('Failed to log booking activity:', logError)
    }

    const response: BookingWebhookResponse = {
      success: true,
      message: `Booking ${webhookRequest.action}ed successfully`,
      booking: updatedBooking,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Booking webhook error:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
