import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tenant-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Try to get tenant_id from request body or header
    let tenantId: string | null = null
    try {
      const body = await req.json()
      tenantId = body.tenantId || null
    } catch {
      // No body, check header
      tenantId = req.headers.get('x-tenant-id')
    }

    // Get payment_mode from tenant_settings (per-tenant) or org_settings (global fallback)
    let paymentMode: string | null = null

    // First try tenant_settings if we have a tenant_id
    if (tenantId) {
      const { data: tenantSettings } = await supabase
        .from('tenant_settings')
        .select('payment_mode')
        .eq('tenant_id', tenantId)
        .single()

      if (tenantSettings?.payment_mode) {
        paymentMode = tenantSettings.payment_mode
        console.log('Using tenant payment_mode:', paymentMode)
      }
    }

    // Fallback to org_settings
    if (!paymentMode) {
      const { data: orgSettings, error } = await supabase
        .from('org_settings')
        .select('payment_mode, booking_payment_mode')
        .limit(1)
        .single()

      if (!error && orgSettings) {
        // Use payment_mode first (what portal settings page uses), then booking_payment_mode as fallback
        paymentMode = orgSettings.payment_mode || orgSettings.booking_payment_mode
        console.log('Using org_settings payment_mode:', paymentMode)
      }
    }

    // Map portal values to booking flow values
    // Portal uses: 'automated' | 'manual'
    // Booking flow expects: 'auto' | 'manual'
    let mode = 'manual' // Default to manual (safer)
    if (paymentMode === 'automated' || paymentMode === 'auto') {
      mode = 'auto'
    } else if (paymentMode === 'manual') {
      mode = 'manual'
    }

    console.log('Returning booking mode:', mode)

    return new Response(
      JSON.stringify({ mode }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in get-booking-mode:', error)
    // Default to manual mode on error
    return new Response(
      JSON.stringify({ mode: 'manual' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})
