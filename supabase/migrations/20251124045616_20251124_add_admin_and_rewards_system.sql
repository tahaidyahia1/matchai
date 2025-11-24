/*
  # Add Admin and Rewards System

  This migration adds comprehensive admin functionality and rewards redemption system.

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key) - Unique admin identifier
      - `email` (text, unique, not null) - Admin email for login
      - `password_hash` (text, not null) - Securely hashed password
      - `full_name` (text, not null) - Admin's full name
      - `role` (text, default 'admin') - Admin role: 'admin', 'super_admin'
      - `is_active` (boolean, default true) - Account status
      - `last_login` (timestamptz) - Last login timestamp
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `rewards_catalog`
      - `id` (uuid, primary key) - Unique reward identifier
      - `name` (text, not null) - Reward name
      - `description` (text) - Reward description
      - `points_required` (integer, not null) - Points needed to redeem
      - `category` (text) - Category: 'drink', 'food', 'merchandise', 'discount'
      - `image_url` (text) - Image URL
      - `is_active` (boolean, default true) - Availability status
      - `stock_quantity` (integer) - Available quantity (null = unlimited)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `redemptions`
      - `id` (uuid, primary key) - Unique redemption identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `reward_id` (uuid, foreign key) - Reference to rewards_catalog
      - `points_spent` (integer, not null) - Points used for redemption
      - `status` (text, default 'pending') - Status: 'pending', 'approved', 'fulfilled', 'cancelled'
      - `redemption_code` (text, unique) - Unique code for verification
      - `approved_by` (uuid, foreign key) - Reference to admin_users (nullable)
      - `approved_at` (timestamptz) - Approval timestamp
      - `fulfilled_at` (timestamptz) - Fulfillment timestamp
      - `notes` (text) - Admin notes
      - `created_at` (timestamptz) - Redemption request timestamp

    - `promotions`
      - `id` (uuid, primary key) - Unique promotion identifier
      - `name` (text, not null) - Promotion name
      - `description` (text) - Promotion description
      - `type` (text, not null) - Type: 'bonus_points', 'multiplier', 'tier_bonus'
      - `value` (decimal) - Promotion value (e.g., 2.0 for 2x multiplier, 50 for 50 bonus points)
      - `min_purchase` (decimal) - Minimum purchase amount to qualify
      - `is_active` (boolean, default true) - Promotion status
      - `start_date` (timestamptz) - Start date
      - `end_date` (timestamptz) - End date
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `admin_audit_log`
      - `id` (uuid, primary key) - Unique log identifier
      - `admin_id` (uuid, foreign key) - Reference to admin_users
      - `action` (text, not null) - Action performed
      - `target_type` (text) - Type of target (user, reward, promotion, etc.)
      - `target_id` (uuid) - ID of target entity
      - `details` (jsonb) - Additional details
      - `ip_address` (text) - Admin's IP address
      - `created_at` (timestamptz) - Action timestamp

  2. Security
    - Enable RLS on all tables
    - Admin tables restricted to admin users only
    - Users can view rewards catalog
    - Users can create redemptions and view their own
    - Comprehensive audit logging

  3. Important Notes
    - Redemption codes are auto-generated
    - Points are deducted when redemption is approved
    - All admin actions are logged
    - Promotions can be scheduled
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Rewards Catalog Table
CREATE TABLE IF NOT EXISTS rewards_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL CHECK (points_required > 0),
  category text DEFAULT 'drink' NOT NULL,
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  stock_quantity integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;

-- Redemptions Table
CREATE TABLE IF NOT EXISTS redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards_catalog(id) ON DELETE RESTRICT,
  points_spent integer NOT NULL CHECK (points_spent > 0),
  status text DEFAULT 'pending' NOT NULL,
  redemption_code text UNIQUE NOT NULL,
  approved_by uuid REFERENCES admin_users(id),
  approved_at timestamptz,
  fulfilled_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  value decimal(10, 2) NOT NULL CHECK (value > 0),
  min_purchase decimal(10, 2) DEFAULT 0 CHECK (min_purchase >= 0),
  is_active boolean DEFAULT true NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (end_date > start_date)
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Admin Audit Log Table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON redemptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view own profile"
  ON admin_users FOR SELECT
  TO anon, authenticated
  USING (id::text = current_setting('app.admin_id', true));

CREATE POLICY "Admin users can update own profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (id::text = current_setting('app.admin_id', true))
  WITH CHECK (id::text = current_setting('app.admin_id', true));

-- RLS Policies for rewards_catalog
CREATE POLICY "Anyone can view active rewards"
  ON rewards_catalog FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage rewards catalog"
  ON rewards_catalog FOR ALL
  TO authenticated
  USING (current_setting('app.admin_id', true) IS NOT NULL)
  WITH CHECK (current_setting('app.admin_id', true) IS NOT NULL);

-- RLS Policies for redemptions
CREATE POLICY "Users can create redemptions"
  ON redemptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text);

CREATE POLICY "Users can view own redemptions"
  ON redemptions FOR SELECT
  TO anon, authenticated
  USING (user_id::text = current_setting('app.user_id', true) OR (select auth.uid())::text = user_id::text OR current_setting('app.admin_id', true) IS NOT NULL);

CREATE POLICY "Admins can update redemptions"
  ON redemptions FOR UPDATE
  TO authenticated
  USING (current_setting('app.admin_id', true) IS NOT NULL)
  WITH CHECK (current_setting('app.admin_id', true) IS NOT NULL);

-- RLS Policies for promotions
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND now() BETWEEN start_date AND end_date);

CREATE POLICY "Admins can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (current_setting('app.admin_id', true) IS NOT NULL)
  WITH CHECK (current_setting('app.admin_id', true) IS NOT NULL);

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (current_setting('app.admin_id', true) IS NOT NULL);

CREATE POLICY "System can create audit logs"
  ON admin_audit_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_rewards_catalog_updated_at ON rewards_catalog;
CREATE TRIGGER update_rewards_catalog_updated_at
  BEFORE UPDATE ON rewards_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Function to generate redemption code
CREATE OR REPLACE FUNCTION generate_redemption_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM redemptions WHERE redemption_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$;
