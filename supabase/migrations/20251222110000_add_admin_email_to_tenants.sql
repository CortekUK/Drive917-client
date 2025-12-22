-- Add admin_email column to tenants table
-- admin_email is used for platform emails (booking confirmations, notifications)
-- contact_email is used for Cortek to contact the tenant admin (integrations, support)

ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS admin_email TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.tenants.admin_email IS 'Email used for platform notifications (booking confirmations, system emails)';
COMMENT ON COLUMN public.tenants.contact_email IS 'Email used for Cortek to contact tenant admin (integrations, support)';

-- Backfill: set admin_email to contact_email for existing tenants where admin_email is null
UPDATE public.tenants
SET admin_email = contact_email
WHERE admin_email IS NULL AND contact_email IS NOT NULL;
