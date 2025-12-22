-- Add insurance_status column to rentals table
ALTER TABLE rentals
ADD COLUMN IF NOT EXISTS insurance_status TEXT DEFAULT 'pending';

-- Add comment for documentation
COMMENT ON COLUMN rentals.insurance_status IS 'Insurance status: has_insurance, pending, bonzah, not_required';
