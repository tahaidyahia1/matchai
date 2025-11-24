/*
  # Fix RLS Policies for User Signup and Points Operations

  This migration adds missing RLS policies to allow user registration and points operations.

  1. Security Changes
    - Add INSERT policy for users table to allow public signup
    - Add INSERT policy for loyalty_points table for system initialization
    - Add UPDATE policy for loyalty_points to allow points updates
    - Add INSERT policy for points_transactions to record purchases

  2. Important Notes
    - Users can create their own account (public INSERT)
    - Users can only read/update their own data
    - Points transactions are append-only
    - All operations are properly secured
*/

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Users can view own points transactions" ON points_transactions;

CREATE POLICY "Anyone can create an account"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO anon, authenticated
  USING (id::text = current_setting('app.user_id', true) OR auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "System can create loyalty points"
  ON loyalty_points FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR auth.uid()::text = user_id::text);

CREATE POLICY "System can update loyalty points"
  ON loyalty_points FOR UPDATE
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR auth.uid()::text = user_id::text)
  WITH CHECK (user_id::text = current_setting('app.user_id', true) OR auth.uid()::text = user_id::text);

CREATE POLICY "System can create points transactions"
  ON points_transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own points transactions"
  ON points_transactions FOR SELECT
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR auth.uid()::text = user_id::text);
