/*
  # Matchai Loyalty System Database Schema

  ## Overview
  Creates a complete loyalty card points tracking system for Matchai business.

  ## New Tables
  
  ### `customers`
  Stores customer information and current points balance.
  - `id` (uuid, primary key) - Unique customer identifier
  - `name` (text, required) - Customer's full name
  - `phone` (text, required, unique) - Customer's phone number (used as unique identifier)
  - `email` (text, optional) - Customer's email address
  - `total_points` (integer, default 0) - Current points balance
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `transactions`
  Records all point additions and subtractions for audit trail.
  - `id` (uuid, primary key) - Unique transaction identifier
  - `customer_id` (uuid, foreign key) - References customers table
  - `points` (integer, required) - Points added (positive) or subtracted (negative)
  - `description` (text, optional) - Transaction description/note
  - `transaction_type` (text, required) - Type: 'purchase', 'reward', 'redemption', 'adjustment'
  - `created_at` (timestamptz) - Transaction timestamp
  - `created_by` (text, optional) - Staff member who created the transaction

  ## Security
  
  ### Row Level Security (RLS)
  - Enabled on both tables
  - All operations require authentication
  - Policies allow authenticated users to manage all customers and transactions
  
  ## Indexes
  - Index on customers.phone for fast lookups
  - Index on transactions.customer_id for efficient transaction history queries
  - Index on transactions.created_at for chronological sorting
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  email text,
  total_points integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  points integer NOT NULL,
  description text,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'reward', 'redemption', 'adjustment')),
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Authenticated users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for transactions table
CREATE POLICY "Authenticated users can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update customer points and updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET 
    total_points = total_points + NEW.points,
    updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update customer points when transaction is added
CREATE TRIGGER update_customer_points_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_points();

-- Create function to update customer updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on customers table
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();