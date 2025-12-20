# Stripe Connect Production Checklist

## Overview

This document outlines everything needed to run Stripe Connect in production.

---

## 1. Stripe Dashboard Setup

### Enable Stripe Connect
```
Dashboard → Settings → Connect settings
├── Enable Connect
├── Platform type: "Platform or marketplace"
└── Account type: "Express"
```

### Switch to Live Mode
```
Toggle from "Test" to "Live" in top-right corner
```

### Get Live Keys
```
Dashboard → Developers → API keys
├── Publishable key: pk_live_...
└── Secret key: sk_live_...
```

---

## 2. Supabase Production Secrets

```bash
# Set production Stripe keys
supabase secrets set STRIPE_SECRET_KEY="sk_live_..."
supabase secrets set STRIPE_CONNECT_WEBHOOK_SECRET="whsec_..."
```

---

## 3. Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### For Booking App (`apps/booking`)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production |

### For Portal App (`apps/portal`)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production |

**Note**: Server-side Stripe operations happen in Supabase Edge Functions, not Vercel. So `STRIPE_SECRET_KEY` is NOT needed in Vercel.

---

## 4. Stripe Webhooks (Production)

### Create Production Webhook

1. Go to: `https://dashboard.stripe.com/webhooks` (Live mode)
2. Click **+ Add endpoint**
3. Configure:

```
Endpoint URL: https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/stripe-connect-webhook

Events to send:
├── account.updated
└── account.application.deauthorized
```

4. Click **Add endpoint**
5. Click **Reveal** on signing secret
6. Copy `whsec_...` and add to Supabase secrets

### Existing Payment Webhook

Your existing `stripe-webhook` function handles payment events. Make sure it's configured:

```
Endpoint URL: https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/stripe-webhook

Events:
├── checkout.session.completed
├── payment_intent.succeeded
├── payment_intent.canceled
├── payment_intent.payment_failed
└── checkout.session.expired
```

---

## 5. Domain Configuration

### CORS Origins

Update edge functions if needed to allow your production domains:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specific domains
  // ...
}
```

### Redirect URLs

The edge functions use `origin` header for success/cancel URLs. Ensure your production domains are properly set.

---

## 6. Connected Account Onboarding URLs

Update these in the edge functions if your domain is different:

**File**: `supabase/functions/create-connected-account/index.ts`
```typescript
const origin = req.headers.get('origin') || 'https://portal.drive-247.com'
```

**File**: `supabase/functions/get-connect-onboarding-link/index.ts`
```typescript
const origin = req.headers.get('origin') || 'https://portal.drive-247.com'
```

---

## 7. Stripe Branding (Connected Accounts)

Configure how your connected accounts appear:

```
Dashboard → Settings → Connect settings → Branding
├── Business name: Drive 247
├── Icon: Upload your logo
└── Brand color: Your primary color
```

---

## 8. Payout Schedule

Configure when connected accounts receive payouts:

```
Dashboard → Settings → Connect settings → Payouts
├── Payout schedule: Daily / Weekly / Monthly
└── Minimum payout amount: $0.00 (or set minimum)
```

---

## 9. Pre-Launch Checklist

### Stripe
- [ ] Connect enabled in production
- [ ] Live API keys obtained
- [ ] Webhook endpoints created (Connect + Payments)
- [ ] Webhook secrets added to Supabase
- [ ] Branding configured
- [ ] Payout schedule set

### Supabase
- [ ] Migration applied to production database
- [ ] All edge functions deployed
- [ ] Production secrets set (STRIPE_SECRET_KEY, STRIPE_CONNECT_WEBHOOK_SECRET)

### Vercel
- [ ] Environment variables set for production
- [ ] Apps redeployed with new env vars

### Testing
- [ ] Create test connected account
- [ ] Complete test payment
- [ ] Verify transfer to connected account
- [ ] Test refund flow

---

## 10. Monitoring

### Stripe Dashboard
- Monitor Connect accounts: Dashboard → Connect → Accounts
- Monitor payments: Dashboard → Payments
- Monitor webhooks: Dashboard → Developers → Webhooks → Logs

### Supabase
- Edge function logs: Dashboard → Edge Functions → Logs
- Database queries: Dashboard → SQL Editor

### Alerts
Set up Stripe alerts for:
- Failed payments
- Account verification issues
- Webhook failures

---

## 11. Going Live Checklist

```
Pre-Production:
├── [ ] All tests passing in test mode
├── [ ] Webhook endpoints responding correctly
└── [ ] Connected account onboarding works

Switch to Production:
├── [ ] Update Supabase secrets to live keys
├── [ ] Update Vercel env vars to live keys
├── [ ] Create live webhook endpoints
├── [ ] Redeploy all apps
└── [ ] Verify first live payment

Post-Launch:
├── [ ] Monitor first few payments
├── [ ] Check connected account payouts
└── [ ] Verify refunds work correctly
```

---

## Troubleshooting Production Issues

### Payments Not Reaching Connected Account
1. Check tenant `stripe_onboarding_complete = true`
2. Verify edge function using correct live secret key
3. Check Stripe dashboard for transfer status

### Webhook Failures
1. Check Supabase edge function logs
2. Verify webhook secret matches
3. Check Stripe webhook logs for errors

### Onboarding Link Expired
- Generate new link via Settings → Stripe Connect → "Complete Onboarding"
- Links expire after 24 hours

---

## Support Contacts

- **Stripe Support**: https://support.stripe.com/
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
