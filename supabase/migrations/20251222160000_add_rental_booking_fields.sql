-- Migration: Add booking-related fields to rentals table
-- These fields align CRM rental creation with customer booking flow

-- ============================================
-- 1. Add pickup/return time columns
-- ============================================
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS pickup_time time,
  ADD COLUMN IF NOT EXISTS return_time time;

COMMENT ON COLUMN public.rentals.pickup_time IS 'Time of day for vehicle pickup';
COMMENT ON COLUMN public.rentals.return_time IS 'Time of day for vehicle return';

-- ============================================
-- 2. Add driver age range column
-- ============================================
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS driver_age_range text
    CHECK (driver_age_range IS NULL OR driver_age_range IN ('under_25', '25_70', 'over_70'));

COMMENT ON COLUMN public.rentals.driver_age_range IS 'Age range of primary driver: under_25, 25_70, or over_70';

-- ============================================
-- 3. Add promo code column
-- ============================================
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS promo_code text;

COMMENT ON COLUMN public.rentals.promo_code IS 'Promotional code applied to this rental';

-- ============================================
-- 4. Add insurance status column
-- ============================================
ALTER TABLE public.rentals
  ADD COLUMN IF NOT EXISTS insurance_status text DEFAULT 'pending'
    CHECK (insurance_status IN ('pending', 'uploaded', 'verified', 'bonzah', 'not_required'));

COMMENT ON COLUMN public.rentals.insurance_status IS 'Status of insurance verification: pending, uploaded (certificate uploaded), verified (AI verified), bonzah (via partner), not_required';

-- ============================================
-- 5. Create indexes for new columns
-- ============================================
CREATE INDEX IF NOT EXISTS idx_rentals_promo_code ON public.rentals(promo_code) WHERE promo_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rentals_insurance_status ON public.rentals(insurance_status);
