/*
  # Create Loyalty Points System

  This migration creates a complete loyalty points system for Matchai with secure user authentication.

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique, not null) - User email for login
      - `password_hash` (text, not null) - Securely hashed password
      - `full_name` (text, not null) - User's full name
      - `phone` (text) - Optional phone number
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `loyalty_points`
      - `id` (uuid, primary key) - Unique record identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `total_points` (integer, default 0) - Current total points balance
      - `lifetime_points` (integer, default 0) - Total points ever earned
      - `tier` (text, default 'Green Member') - Current loyalty tier
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `points_transactions`
      - `id` (uuid, primary key) - Unique transaction identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `points` (integer, not null) - Points earned or spent (positive/negative)
      - `transaction_type` (text, not null) - Type: 'purchase', 'redeem', 'bonus', 'adjustment'
      - `order_amount` (decimal) - Purchase amount in MAD
      - `description` (text) - Transaction description
      - `created_at` (timestamptz) - Transaction timestamp

  2. Security
    - Enable RLS on all tables
    - Users can only read/update their own data
    - Points transactions are append-only for users
    - Authenticated users only

  3. Important Notes
    - Points calculation: 1 point per 10 MAD spent
    - Tier system: Green (0-99), Silver (100-199), Gold (200+)
    - All monetary values stored in MAD currency
    - Password hashing should be done in application layer
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0 NOT NULL,
  lifetime_points integer DEFAULT 0 NOT NULL,
  tier text DEFAULT 'Green Member' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  transaction_type text NOT NULL,
  order_amount decimal(10, 2),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own points transactions"
  ON points_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_loyalty_points_updated_at'
  ) THEN
    CREATE TRIGGER update_loyalty_points_updated_at
      BEFORE UPDATE ON loyalty_points
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
