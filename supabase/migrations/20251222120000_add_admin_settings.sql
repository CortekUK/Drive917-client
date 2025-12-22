-- Create admin_settings table for storing admin dashboard configuration
CREATE TABLE IF NOT EXISTS "public"."admin_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "notification_emails" "text"[] DEFAULT ARRAY['ilyasghulam35@gmail.com']::"text"[],
    "contact_form_enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."admin_settings" OWNER TO "postgres";

-- Insert default settings
INSERT INTO "public"."admin_settings" ("notification_emails", "contact_form_enabled")
VALUES (ARRAY['ilyasghulam35@gmail.com'], true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE "public"."admin_settings" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_authenticated_settings_select" ON "public"."admin_settings";
DROP POLICY IF EXISTS "allow_authenticated_settings_update" ON "public"."admin_settings";
DROP POLICY IF EXISTS "allow_authenticated_settings_insert" ON "public"."admin_settings";

-- Policy for authenticated users to read settings
CREATE POLICY "allow_authenticated_settings_select" ON "public"."admin_settings"
    FOR SELECT USING (("auth"."uid"() IS NOT NULL));

-- Policy for authenticated users to update settings
CREATE POLICY "allow_authenticated_settings_update" ON "public"."admin_settings"
    FOR UPDATE USING (("auth"."uid"() IS NOT NULL));

-- Policy for authenticated users to insert settings (if none exist)
CREATE POLICY "allow_authenticated_settings_insert" ON "public"."admin_settings"
    FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));

-- Grant permissions
GRANT ALL ON TABLE "public"."admin_settings" TO "anon";
GRANT ALL ON TABLE "public"."admin_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_settings" TO "service_role";
