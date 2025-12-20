-- Add Stripe Connect columns to tenants table
-- These columns enable direct payment routing to tenant bank accounts

ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_account_status TEXT DEFAULT 'pending'
  CHECK (stripe_account_status IN ('pending', 'active', 'restricted', 'disabled'));

-- Add index for faster lookups by stripe_account_id
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_account_id
ON public.tenants(stripe_account_id)
WHERE stripe_account_id IS NOT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN public.tenants.stripe_account_id IS 'Stripe Connect account ID (acct_xxx) for receiving payments';
COMMENT ON COLUMN public.tenants.stripe_onboarding_complete IS 'Whether tenant has completed Stripe Connect onboarding';
COMMENT ON COLUMN public.tenants.stripe_account_status IS 'Status of Stripe Connect account: pending, active, restricted, disabled';
