/*
  # Fix Security and Performance Issues

  This migration optimizes RLS policies for better performance and fixes security issues.

  1. Performance Optimizations
    - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Function Security
    - Fix search_path for `update_updated_at` function
    - Use `SECURITY DEFINER` with explicit schema qualification

  3. Index Cleanup
    - Remove unused indexes that are not providing value
    - Keep only the essential index on loyalty_points(user_id)

  4. Important Notes
    - All policies maintain the same security guarantees
    - Only performance characteristics are improved
    - Function now has immutable search_path
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can create an account" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "System can create loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "System can update loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "System can create points transactions" ON points_transactions;
DROP POLICY IF EXISTS "Users can view own points transactions" ON points_transactions;

-- Recreate policies with optimized auth.uid() calls
CREATE POLICY "Anyone can create an account"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO anon, authenticated
  USING (id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "System can create loyalty points"
  ON loyalty_points FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text);

CREATE POLICY "System can update loyalty points"
  ON loyalty_points FOR UPDATE
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text)
  WITH CHECK (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text);

CREATE POLICY "System can create points transactions"
  ON points_transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own points transactions"
  ON points_transactions FOR SELECT
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text);

-- Fix function search path issue
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_loyalty_points_updated_at ON loyalty_points;
CREATE TRIGGER update_loyalty_points_updated_at
  BEFORE UPDATE ON loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Remove unused indexes
DROP INDEX IF EXISTS idx_points_transactions_user_id;
DROP INDEX IF EXISTS idx_points_transactions_created_at;
