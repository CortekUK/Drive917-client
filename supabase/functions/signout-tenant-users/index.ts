import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

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

    console.log(`Signing out all users for tenant: ${tenantId}`)

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get all app_users for this tenant
    const { data: appUsers, error: fetchError } = await supabaseAdmin
      .from('app_users')
      .select('auth_user_id, email')
      .eq('tenant_id', tenantId)

    if (fetchError) {
      console.error('Error fetching app users:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tenant users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!appUsers || appUsers.length === 0) {
      console.log('No users found for tenant:', tenantId)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No users found for this tenant',
          signedOutCount: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Found ${appUsers.length} users to sign out`)

    // Sign out each user using admin API
    let signedOutCount = 0
    const errors: string[] = []

    for (const appUser of appUsers) {
      if (!appUser.auth_user_id) {
        console.log(`Skipping user ${appUser.email} - no auth_user_id`)
        continue
      }

      try {
        // Use admin API to sign out user (invalidates all their sessions)
        const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(
          appUser.auth_user_id,
          'global' // Sign out from all devices
        )

        if (signOutError) {
          console.error(`Error signing out user ${appUser.email}:`, signOutError)
          errors.push(`${appUser.email}: ${signOutError.message}`)
        } else {
          console.log(`Signed out user: ${appUser.email}`)
          signedOutCount++
        }
      } catch (err: any) {
        console.error(`Exception signing out user ${appUser.email}:`, err)
        errors.push(`${appUser.email}: ${err.message}`)
      }
    }

    console.log(`Successfully signed out ${signedOutCount}/${appUsers.length} users`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Signed out ${signedOutCount} users`,
        signedOutCount,
        totalUsers: appUsers.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error('Error in signout-tenant-users:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
