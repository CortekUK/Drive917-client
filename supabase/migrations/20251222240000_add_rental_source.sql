-- Add source column to rentals to track where the rental was created from
ALTER TABLE rentals
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'portal';

-- Add comment for documentation
COMMENT ON COLUMN rentals.source IS 'Source of rental creation: booking (customer booking flow) or portal (CRM/admin created)';
