// Supabase Edge Function: lead-intake
// Public-facing endpoint for new lead capture from website forms

import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase.ts'

interface LeadIntakeRequest {
  business_name: string
  contact_name: string
  email: string
  phone: string
  industry: string
  location: string
  budget_range: string
  source: string
  notes?: string
}

interface LeadIntakeResponse {
  success: boolean
  message: string
  lead_id?: string
  booking_id?: string
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

    const leadRequest: LeadIntakeRequest = await req.json()

    // Validate required fields
    const requiredFields = ['business_name', 'contact_name', 'email', 'phone', 'industry', 'location', 'budget_range', 'source']
    const missingFields = requiredFields.filter(field => !leadRequest[field as keyof LeadIntakeRequest])

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: corsHeaders }
      )
    }

    const supabase = createSupabaseClient()

    // Create the lead
    const leadId = crypto.randomUUID()
    const now = new Date().toISOString()

    const { error: leadError } = await supabase.from('leads').insert({
      id: leadId,
      name: leadRequest.contact_name,
      email: leadRequest.email,
      phone: leadRequest.phone,
      business_name: leadRequest.business_name,
      website_url: '',
      industry: leadRequest.industry,
      location: leadRequest.location,
      status: 'new',
      source: leadRequest.source,
      score: 0,
      budget_range: leadRequest.budget_range,
      urgency: 'Exploring options',
      notes: leadRequest.notes || '',
      assigned_agent: '', // To be assigned by orchestrator
      next_follow_up: null,
      created_at: now,
      updated_at: now,
    })

    if (leadError) {
      console.error('Failed to create lead:', leadError)
      return new Response(
        JSON.stringify({ error: 'Failed to create lead' }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Create a booking suggestion
    const bookingId = crypto.randomUUID()
    const { error: bookingError } = await supabase.from('bookings').insert({
      id: bookingId,
      lead_id: leadId,
      name: leadRequest.contact_name,
      email: leadRequest.email,
      phone: leadRequest.phone,
      business_name: leadRequest.business_name,
      website_url: '',
      goal: `Discussed on intake form: ${leadRequest.notes || 'Website project'}`,
      preferred_date: null,
      preferred_time: null,
      status: 'pending',
      notes: `Lead intake from ${leadRequest.source}`,
      meeting_link: null,
      created_at: now,
      updated_at: now,
    })

    if (bookingError) {
      console.error('Failed to create booking suggestion:', bookingError)
      // Don't fail the response; booking creation is secondary
    }

    // Log the activity as system action
    const { error: logError } = await supabase.from('activities').insert({
      id: crypto.randomUUID(),
      agent_name: 'System',
      action: 'New lead intake',
      description: `${leadRequest.contact_name} from ${leadRequest.business_name} submitted intake form (${leadRequest.industry})`,
      entity_type: 'lead',
      entity_id: leadId,
      timestamp: now,
    })

    if (logError) {
      console.error('Failed to log activity:', logError)
    }

    const response: LeadIntakeResponse = {
      success: true,
      message: `Lead created successfully. Booking suggestion created.`,
      lead_id: leadId,
      booking_id: bookingId,
    }

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: corsHeaders,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Lead intake error:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
