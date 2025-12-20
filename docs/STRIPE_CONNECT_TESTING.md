# Stripe Connect Testing Guide

This guide walks you through testing all Stripe Connect scenarios.

## Prerequisites

1. **Two Stripe accounts** (both in test mode):
   - Platform account (Drive247) - has Stripe Connect enabled
   - Tenant account (Fleetvana) - will be connected

2. **Test card numbers**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires auth: `4000 0025 0000 3155`

3. **Environment ready**:
   - Migration applied
   - Edge functions deployed
   - Secrets configured

---

## Test Scenarios

### Test 1: Create Connected Account

**Goal**: Create a Stripe Connect account for a tenant

**Steps**:
1. Go to Portal → Settings → Stripe Connect tab
2. Click "Set Up Stripe Connect"
3. Complete Stripe onboarding in the new tab
4. Return to portal and refresh

**Expected**:
- `tenants.stripe_account_id` populated with `acct_xxx`
- Status shows "Stripe Connected" (green)
- Payouts: Enabled

**Verify in Stripe Dashboard**:
```
Platform Dashboard → Connect → Accounts → See new account
```

---

### Test 2: Immediate Payment (Auto Mode)

**Goal**: Customer pays and money goes to tenant

**Steps**:
1. Ensure tenant has Stripe Connect set up
2. Set booking payment mode to "Automated" in Settings
3. Create a booking on the booking site
4. Complete checkout with test card `4242 4242 4242 4242`

**Expected**:
- Payment successful
- Rental activated immediately
- In Stripe: Payment shows transfer to connected account

**Verify in Stripe**:
```
Platform Dashboard → Payments → Click payment → See "Transfer" section
Tenant Dashboard → Payments → See incoming transfer
```

**Database Check**:
```sql
SELECT
  p.amount,
  p.status,
  p.stripe_payment_intent_id,
  t.stripe_account_id
FROM payments p
JOIN tenants t ON p.tenant_id = t.id
WHERE p.rental_id = '<rental_id>';
```

---

### Test 3: Pre-Authorization (Manual Mode)

**Goal**: Hold funds, then capture

**Steps**:
1. Set booking payment mode to "Manual Approval" in Settings
2. Create a booking on the booking site
3. Complete checkout with test card
4. Go to Portal → Payments → Find pending payment
5. Click "Approve" to capture

**Expected (After Card Hold)**:
- Payment status: "Pending Review"
- Rental status: "Pending"
- `capture_status`: "requires_capture"
- Customer card shows pending hold

**Expected (After Approve)**:
- Payment status: "Applied"
- Rental status: "Active"
- `capture_status`: "captured"
- Money transferred to tenant

**Verify in Stripe**:
```
Before capture: PaymentIntent status = "requires_capture"
After capture: PaymentIntent status = "succeeded"
```

---

### Test 4: Pre-Auth Rejection

**Goal**: Reject a pre-authorized payment

**Steps**:
1. Create a booking with Manual mode
2. Complete checkout
3. Go to Portal → Payments → Find pending payment
4. Click "Reject"

**Expected**:
- Hold released on customer's card
- Payment status: "Cancelled"
- Rental status: "Cancelled"
- No money moved

**Verify in Stripe**:
```
PaymentIntent status = "canceled"
```

---

### Test 5: Full Refund

**Goal**: Refund a captured payment, money pulled from tenant

**Steps**:
1. Complete a successful payment (Test 2 or 3)
2. Go to Portal → Rentals → Select the rental
3. Click "Cancel Rental"
4. Select "Full Refund"
5. Confirm

**Expected**:
- Customer receives full refund
- Money pulled from tenant's Stripe balance
- Payment status: "Refunded"

**Verify in Stripe**:
```
Platform Dashboard → Payments → Click payment → See "Refund" section
Refund shows: "Transfer reversed"
Tenant Dashboard → Balance → See negative adjustment
```

**Database Check**:
```sql
SELECT
  status,
  refund_status,
  stripe_refund_id,
  capture_status
FROM payments
WHERE rental_id = '<rental_id>';
```

---

### Test 6: Partial Refund

**Goal**: Refund part of a payment

**Steps**:
1. Complete a $1000 payment
2. Cancel rental with "Partial Refund" option
3. Enter $200 as refund amount
4. Confirm

**Expected**:
- Customer receives $200 refund
- $200 pulled from tenant's balance
- Payment status: "Partial Refund"
- `refund_amount`: 200

---

### Test 7: Scheduled Refund

**Goal**: Schedule a refund for future date

**Steps**:
1. Complete a payment
2. Go to Portal → Payments → Select payment
3. Click "Schedule Refund"
4. Set date to tomorrow
5. Wait for cron job (or manually trigger)

**Expected**:
- `refund_status`: "scheduled"
- When cron runs: refund processed
- `refund_status`: "completed"

---

### Test 8: Tenant Not Connected

**Goal**: Verify payments blocked for unconnected tenants

**Steps**:
1. Create a new tenant without Stripe Connect
2. Try to create a booking for that tenant

**Expected**:
- Error message: "Payments not available"
- No checkout session created

---

## API Testing with cURL

### Create Connected Account
```bash
curl -X POST https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/create-connected-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "tenantId": "your-tenant-uuid",
    "email": "tenant@example.com",
    "businessName": "Fleetvana LLC"
  }'
```

### Get Onboarding Link
```bash
curl -X POST https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/get-connect-onboarding-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "tenantId": "your-tenant-uuid"
  }'
```

### Create Checkout (with Connect)
```bash
curl -X POST https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "x-tenant-slug: fleetvana" \
  -d '{
    "rentalId": "rental-uuid",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "totalAmount": 1000,
    "tenantSlug": "fleetvana"
  }'
```

---

## Webhook Testing

### Using Stripe CLI (Recommended)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your function
stripe listen --forward-connect-to https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/stripe-connect-webhook

# In another terminal, trigger test events
stripe trigger account.updated
```

### Manual Webhook Test
```bash
curl -X POST https://hviqoaokxvlancmftwuo.supabase.co/functions/v1/stripe-connect-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "account.updated",
    "data": {
      "object": {
        "id": "acct_test123",
        "charges_enabled": true,
        "payouts_enabled": true,
        "requirements": {
          "currently_due": [],
          "disabled_reason": null
        }
      }
    }
  }'
```

---

## Troubleshooting

### Payment Not Routing to Tenant
1. Check tenant has `stripe_account_id`
2. Check `stripe_onboarding_complete = true`
3. Check edge function logs:
   ```bash
   supabase functions logs create-checkout-session
   ```

### Webhook Not Updating Status
1. Verify webhook secret is set
2. Check edge function logs:
   ```bash
   supabase functions logs stripe-connect-webhook
   ```
3. Check Stripe webhook logs in Dashboard

### Refund Failed
1. Check tenant has sufficient balance
2. Verify `reverse_transfer: true` in refund call
3. Check Stripe error in function logs

---

## Verification Queries

### Check Tenant Connect Status
```sql
SELECT
  slug,
  company_name,
  stripe_account_id,
  stripe_onboarding_complete,
  stripe_account_status
FROM tenants
WHERE slug = 'fleetvana';
```

### Check Payment with Transfer
```sql
SELECT
  p.id,
  p.amount,
  p.status,
  p.stripe_payment_intent_id,
  p.capture_status,
  t.stripe_account_id as destination_account
FROM payments p
JOIN tenants t ON p.tenant_id = t.id
ORDER BY p.created_at DESC
LIMIT 5;
```

### Check Refunds
```sql
SELECT
  id,
  amount,
  refund_status,
  refund_amount,
  stripe_refund_id,
  refund_processed_at
FROM payments
WHERE refund_status IS NOT NULL AND refund_status != 'none';
```
