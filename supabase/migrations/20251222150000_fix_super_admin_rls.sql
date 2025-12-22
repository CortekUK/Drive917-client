-- Migration: Fix RLS policies to properly check super admin from app_users table
-- The previous migration checked JWT claims for is_super_admin, but it's stored in app_users

-- ============================================================================
-- STEP 1: Create helper function to check if current user is super admin
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM app_users WHERE auth_user_id = auth.uid() LIMIT 1),
    false
  );
$$;

-- Grant execute to authenticated
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ============================================================================
-- STEP 2: Create helper function to get user's tenant_id (or allow all for super admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT tenant_id FROM app_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_tenant_id() TO authenticated;

-- ============================================================================
-- STEP 3: Update RLS policies on rentals table
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view rentals for their tenant" ON public.rentals;
DROP POLICY IF EXISTS "Users can insert rentals for their tenant" ON public.rentals;
DROP POLICY IF EXISTS "Users can update rentals for their tenant" ON public.rentals;
DROP POLICY IF EXISTS "Users can delete rentals for their tenant" ON public.rentals;
DROP POLICY IF EXISTS "Authenticated users can view own tenant rentals" ON public.rentals;
DROP POLICY IF EXISTS "Authenticated users can insert own tenant rentals" ON public.rentals;
DROP POLICY IF EXISTS "Authenticated users can update own tenant rentals" ON public.rentals;
-- Also drop the new policy names in case they already exist
DROP POLICY IF EXISTS "Users can view rentals for their tenant or super admin" ON public.rentals;
DROP POLICY IF EXISTS "Users can insert rentals for their tenant or super admin" ON public.rentals;
DROP POLICY IF EXISTS "Users can update rentals for their tenant or super admin" ON public.rentals;
DROP POLICY IF EXISTS "Users can delete rentals for their tenant or super admin" ON public.rentals;

-- Create new policies that allow super admin access
CREATE POLICY "Users can view rentals for their tenant or super admin"
ON public.rentals
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can insert rentals for their tenant or super admin"
ON public.rentals
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can update rentals for their tenant or super admin"
ON public.rentals
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can delete rentals for their tenant or super admin"
ON public.rentals
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- STEP 4: Update RLS policies on vehicles table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view vehicles for their tenant" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert vehicles for their tenant" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update vehicles for their tenant" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete vehicles for their tenant" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can view own tenant vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can insert own tenant vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can update own tenant vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can view vehicles for their tenant or super admin" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert vehicles for their tenant or super admin" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update vehicles for their tenant or super admin" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete vehicles for their tenant or super admin" ON public.vehicles;

CREATE POLICY "Users can view vehicles for their tenant or super admin"
ON public.vehicles
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can insert vehicles for their tenant or super admin"
ON public.vehicles
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can update vehicles for their tenant or super admin"
ON public.vehicles
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can delete vehicles for their tenant or super admin"
ON public.vehicles
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- STEP 5: Update RLS policies on customers table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view customers for their tenant" ON public.customers;
DROP POLICY IF EXISTS "Users can insert customers for their tenant" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers for their tenant" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers for their tenant" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view own tenant customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert own tenant customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update own tenant customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view customers for their tenant or super admin" ON public.customers;
DROP POLICY IF EXISTS "Users can insert customers for their tenant or super admin" ON public.customers;
DROP POLICY IF EXISTS "Users can update customers for their tenant or super admin" ON public.customers;
DROP POLICY IF EXISTS "Users can delete customers for their tenant or super admin" ON public.customers;

CREATE POLICY "Users can view customers for their tenant or super admin"
ON public.customers
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can insert customers for their tenant or super admin"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can update customers for their tenant or super admin"
ON public.customers
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can delete customers for their tenant or super admin"
ON public.customers
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- STEP 6: Update RLS policies on payments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view payments for their tenant" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for their tenant" ON public.payments;
DROP POLICY IF EXISTS "Users can update payments for their tenant" ON public.payments;
DROP POLICY IF EXISTS "Users can delete payments for their tenant" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can view own tenant payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can insert own tenant payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can update own tenant payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view payments for their tenant or super admin" ON public.payments;
DROP POLICY IF EXISTS "Users can insert payments for their tenant or super admin" ON public.payments;
DROP POLICY IF EXISTS "Users can update payments for their tenant or super admin" ON public.payments;
DROP POLICY IF EXISTS "Users can delete payments for their tenant or super admin" ON public.payments;

CREATE POLICY "Users can view payments for their tenant or super admin"
ON public.payments
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can insert payments for their tenant or super admin"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can update payments for their tenant or super admin"
ON public.payments
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can delete payments for their tenant or super admin"
ON public.payments
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- STEP 7: Update RLS policies on fines table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view fines for their tenant" ON public.fines;
DROP POLICY IF EXISTS "Users can insert fines for their tenant" ON public.fines;
DROP POLICY IF EXISTS "Users can update fines for their tenant" ON public.fines;
DROP POLICY IF EXISTS "Users can delete fines for their tenant" ON public.fines;
DROP POLICY IF EXISTS "Authenticated users can view own tenant fines" ON public.fines;
DROP POLICY IF EXISTS "Users can view fines for their tenant or super admin" ON public.fines;
DROP POLICY IF EXISTS "Users can insert fines for their tenant or super admin" ON public.fines;
DROP POLICY IF EXISTS "Users can update fines for their tenant or super admin" ON public.fines;
DROP POLICY IF EXISTS "Users can delete fines for their tenant or super admin" ON public.fines;

CREATE POLICY "Users can view fines for their tenant or super admin"
ON public.fines
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can insert fines for their tenant or super admin"
ON public.fines
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can update fines for their tenant or super admin"
ON public.fines
FOR UPDATE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

CREATE POLICY "Users can delete fines for their tenant or super admin"
ON public.fines
FOR DELETE
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- STEP 8: Update RLS policies on blocked_identities table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their tenant blocked identities" ON public.blocked_identities;
DROP POLICY IF EXISTS "Users can view blocked identities for their tenant or super admin" ON public.blocked_identities;

CREATE POLICY "Users can view blocked identities for their tenant or super admin"
ON public.blocked_identities
FOR SELECT
TO authenticated
USING (
  tenant_id = public.get_user_tenant_id()
  OR public.is_super_admin()
);

-- ============================================================================
-- Done! Super admins can now access all tenants' data
-- ============================================================================
