#!/bin/bash

# Stripe Connect Deployment Script
# Run from the monorepo root: ./scripts/deploy-stripe-connect.sh

set -e

echo "🚀 Deploying Stripe Connect to Supabase..."
echo ""

# Navigate to supabase directory
cd "$(dirname "$0")/../supabase"

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in
echo "📋 Checking Supabase login status..."
supabase projects list > /dev/null 2>&1 || {
    echo "❌ Not logged in. Run: supabase login"
    exit 1
}

echo "✅ Logged in to Supabase"
echo ""

# Run migrations
echo "📦 Running database migrations..."
supabase db push

echo ""
echo "✅ Migrations applied"
echo ""

# Deploy edge functions
echo "⚡ Deploying edge functions..."

echo "  → create-connected-account"
supabase functions deploy create-connected-account --no-verify-jwt

echo "  → get-connect-onboarding-link"
supabase functions deploy get-connect-onboarding-link --no-verify-jwt

echo "  → stripe-connect-webhook"
supabase functions deploy stripe-connect-webhook --no-verify-jwt

echo "  → create-checkout-session (updated)"
supabase functions deploy create-checkout-session --no-verify-jwt

echo "  → create-preauth-checkout (updated)"
supabase functions deploy create-preauth-checkout --no-verify-jwt

echo "  → cancel-rental-refund (updated)"
supabase functions deploy cancel-rental-refund --no-verify-jwt

echo "  → process-scheduled-refund (updated)"
supabase functions deploy process-scheduled-refund --no-verify-jwt

echo ""
echo "✅ All edge functions deployed!"
echo ""

echo "📝 Next steps:"
echo "   1. Set Stripe secrets:"
echo "      supabase secrets set STRIPE_SECRET_KEY=\"sk_test_...\""
echo "      supabase secrets set STRIPE_CONNECT_WEBHOOK_SECRET=\"whsec_...\""
echo ""
echo "   2. Add webhook in Stripe Dashboard:"
echo "      URL: https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/stripe-connect-webhook"
echo "      Events: account.updated, account.application.deauthorized"
echo ""
echo "🎉 Stripe Connect deployment complete!"
