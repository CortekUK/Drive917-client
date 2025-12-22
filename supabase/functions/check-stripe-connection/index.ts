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
    const { tenantId } = await req.json()

    if (!tenantId) {
      return new Response(
        JSON.stringify({ error: 'tenantId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Checking Stripe connection for tenant: ${tenantId}`)

    // Query Stripe for connected accounts
    // We need to iterate through accounts since Stripe doesn't support filtering by metadata
    let matchingAccount: Stripe.Account | null = null
    let hasMore = true
    let startingAfter: string | undefined = undefined
    let totalAccountsChecked = 0

    while (hasMore && !matchingAccount) {
      const params: Stripe.AccountListParams = { limit: 100 }
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      const accounts = await stripe.accounts.list(params)
      totalAccountsChecked += accounts.data.length

      console.log(`Checked ${accounts.data.length} accounts (total: ${totalAccountsChecked}), hasMore: ${accounts.has_more}`)

      // Log all accounts and their metadata for debugging
      for (const acc of accounts.data) {
        console.log(`Account ${acc.id}: metadata = ${JSON.stringify(acc.metadata)}`)
      }

      // Find account with matching tenant_id in metadata
      matchingAccount = accounts.data.find(
        (acc) => acc.metadata?.tenant_id === tenantId
      ) || null

      hasMore = accounts.has_more
      if (accounts.data.length > 0) {
        startingAfter = accounts.data[accounts.data.length - 1].id
      }
    }

    console.log(`Total accounts checked: ${totalAccountsChecked}`)

    if (!matchingAccount) {
      console.log(`No Stripe account found for tenant: ${tenantId}`)
      return new Response(
        JSON.stringify({
          connected: false,
          message: 'No connected Stripe account found for this tenant'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Found Stripe account ${matchingAccount.id} for tenant: ${tenantId}`)

    // Determine account status
    let status = 'pending'
    let onboardingComplete = false

    if (matchingAccount.charges_enabled && matchingAccount.payouts_enabled) {
      status = 'active'
      onboardingComplete = true
    } else if (matchingAccount.requirements?.disabled_reason) {
      status = 'restricted'
    } else if (matchingAccount.requirements?.currently_due?.length === 0) {
      status = 'active'
      onboardingComplete = true
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update tenant with Stripe account info
    const { error: updateError } = await supabaseClient
      .from('tenants')
      .update({
        stripe_account_id: matchingAccount.id,
        stripe_account_status: status,
        stripe_onboarding_complete: onboardingComplete,
      })
      .eq('id', tenantId)

    if (updateError) {
      console.error('Error updating tenant:', updateError)
      // Still return success since we found the account
    } else {
      console.log(`Updated tenant ${tenantId} with Stripe account: status=${status}, onboarding=${onboardingComplete}`)
    }

    return new Response(
      JSON.stringify({
        connected: true,
        accountId: matchingAccount.id,
        status: status,
        onboardingComplete: onboardingComplete,
        chargesEnabled: matchingAccount.charges_enabled,
        payoutsEnabled: matchingAccount.payouts_enabled,
        email: matchingAccount.email,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error checking Stripe connection:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
