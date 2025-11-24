/*
  # Fix All Security and Performance Issues

  This migration addresses all reported security and performance issues:

  1. **Missing Indexes on Foreign Keys**
     - Add index on `points_transactions.user_id`
     - Add index on `redemptions.approved_by`
     - Add index on `redemptions.reward_id`

  2. **RLS Policy Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation for each row, improving performance

  3. **Remove Unused Indexes**
     - Drop `idx_redemptions_status`
     - Drop `idx_redemptions_created_at`
     - Drop `idx_promotions_dates`
     - Drop `idx_admin_audit_log_admin_id`
     - Drop `idx_admin_audit_log_created_at`

  4. **Fix Multiple Permissive Policies**
     - Consolidate policies for `promotions` SELECT
     - Consolidate policies for `rewards_catalog` SELECT

  5. **Fix Function Search Path**
     - Set immutable search_path for `generate_redemption_code` function

  All changes are designed to improve query performance and security at scale.
*/

-- =====================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id 
  ON public.points_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_redemptions_approved_by 
  ON public.redemptions(approved_by);

CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id 
  ON public.redemptions(reward_id);

-- =====================================================
-- 2. REMOVE UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS public.idx_redemptions_status;
DROP INDEX IF EXISTS public.idx_redemptions_created_at;
DROP INDEX IF EXISTS public.idx_promotions_dates;
DROP INDEX IF EXISTS public.idx_admin_audit_log_admin_id;
DROP INDEX IF EXISTS public.idx_admin_audit_log_created_at;

-- =====================================================
-- 3. FIX RLS POLICIES - OPTIMIZE AUTH.UID() CALLS
-- =====================================================

-- Drop existing policies and recreate with optimized queries

-- USERS TABLE
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- LOYALTY_POINTS TABLE
DROP POLICY IF EXISTS "Users can view own loyalty points" ON public.loyalty_points;
DROP POLICY IF EXISTS "System can update loyalty points" ON public.loyalty_points;

CREATE POLICY "Users can view own loyalty points"
  ON public.loyalty_points
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "System can update loyalty points"
  ON public.loyalty_points
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- POINTS_TRANSACTIONS TABLE
DROP POLICY IF EXISTS "Users can view own points transactions" ON public.points_transactions;

CREATE POLICY "Users can view own points transactions"
  ON public.points_transactions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ADMIN_USERS TABLE
DROP POLICY IF EXISTS "Admin users can view own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update own profile" ON public.admin_users;

CREATE POLICY "Admin users can view own profile"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Admin users can update own profile"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- REDEMPTIONS TABLE
DROP POLICY IF EXISTS "Users can create redemptions" ON public.redemptions;
DROP POLICY IF EXISTS "Users can view own redemptions" ON public.redemptions;
DROP POLICY IF EXISTS "Admins can view all redemptions" ON public.redemptions;
DROP POLICY IF EXISTS "Admins can update redemptions" ON public.redemptions;

CREATE POLICY "Users can create redemptions"
  ON public.redemptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own redemptions"
  ON public.redemptions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all redemptions"
  ON public.redemptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update redemptions"
  ON public.redemptions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ADMIN_AUDIT_LOG TABLE
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can create audit logs" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can create audit logs"
  ON public.admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- =====================================================
-- 4. FIX MULTIPLE PERMISSIVE POLICIES
-- =====================================================

-- REWARDS_CATALOG - Consolidate SELECT policies
DROP POLICY IF EXISTS "Anyone can view active rewards" ON public.rewards_catalog;
DROP POLICY IF EXISTS "Admins can manage rewards catalog" ON public.rewards_catalog;

-- Single SELECT policy: anyone can view active, admins can view all
CREATE POLICY "View rewards catalog"
  ON public.rewards_catalog
  FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    OR EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- Separate admin management policies
CREATE POLICY "Admins can insert rewards"
  ON public.rewards_catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update rewards"
  ON public.rewards_catalog
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete rewards"
  ON public.rewards_catalog
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- PROMOTIONS - Consolidate SELECT policies
DROP POLICY IF EXISTS "Anyone can view active promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.promotions;

-- Single SELECT policy: anyone can view active, admins can view all
CREATE POLICY "View promotions"
  ON public.promotions
  FOR SELECT
  TO authenticated
  USING (
    (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE)
    OR EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- Separate admin management policies
CREATE POLICY "Admins can insert promotions"
  ON public.promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update promotions"
  ON public.promotions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete promotions"
  ON public.promotions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- =====================================================
-- 5. FIX FUNCTION SEARCH PATH
-- =====================================================

-- Recreate generate_redemption_code function with stable search_path
CREATE OR REPLACE FUNCTION public.generate_redemption_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    SELECT EXISTS(
      SELECT 1 FROM redemptions WHERE redemption_code = code
    ) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;