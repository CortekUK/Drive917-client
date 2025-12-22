import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { tenantId, stripeAccountId } = await req.json()

    if (!tenantId && !stripeAccountId) {
      return new Response(
        JSON.stringify({ error: 'tenantId or stripeAccountId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let accountIdToDelete = stripeAccountId

    // If no stripeAccountId provided, look it up from the tenant
    if (!accountIdToDelete && tenantId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: tenant, error: tenantError } = await supabaseClient
        .from('tenants')
        .select('stripe_account_id')
        .eq('id', tenantId)
        .single()

      if (tenantError) {
        console.error('Error fetching tenant:', tenantError)
        return new Response(
          JSON.stringify({ error: 'Tenant not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      accountIdToDelete = tenant?.stripe_account_id
    }

    // If no Stripe account to delete, return success
    if (!accountIdToDelete) {
      console.log('No Stripe account to delete for tenant:', tenantId)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No Stripe account was associated with this tenant'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Deleting Stripe Connect account: ${accountIdToDelete}`)

    // Delete the Stripe Connect account
    // For Express accounts, this removes the account from your platform
    try {
      const deleted = await stripe.accounts.del(accountIdToDelete)
      console.log(`Stripe account ${accountIdToDelete} deleted:`, deleted)

      return new Response(
        JSON.stringify({
          success: true,
          deleted: true,
          accountId: accountIdToDelete,
          message: 'Stripe Connect account has been disconnected and deleted'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (stripeError: any) {
      // If account doesn't exist or is already deleted, that's fine
      if (stripeError.code === 'account_invalid' || stripeError.code === 'resource_missing') {
        console.log(`Stripe account ${accountIdToDelete} already deleted or invalid`)
        return new Response(
          JSON.stringify({
            success: true,
            deleted: false,
            accountId: accountIdToDelete,
            message: 'Stripe account was already deleted or does not exist'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      // Re-throw other errors
      throw stripeError
    }
  } catch (error: any) {
    console.error('Error deleting connected account:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
