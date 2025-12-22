-- Add columns to store Veriff media URLs (document images, face photo)
ALTER TABLE identity_verifications
ADD COLUMN IF NOT EXISTS document_front_url TEXT,
ADD COLUMN IF NOT EXISTS document_back_url TEXT,
ADD COLUMN IF NOT EXISTS face_image_url TEXT,
ADD COLUMN IF NOT EXISTS media_fetched_at TIMESTAMPTZ;

-- Add comment explaining the columns
COMMENT ON COLUMN identity_verifications.document_front_url IS 'URL to front of ID document from Veriff';
COMMENT ON COLUMN identity_verifications.document_back_url IS 'URL to back of ID document from Veriff';
COMMENT ON COLUMN identity_verifications.face_image_url IS 'URL to face photo from Veriff verification';
COMMENT ON COLUMN identity_verifications.media_fetched_at IS 'Timestamp when media URLs were fetched from Veriff API';
