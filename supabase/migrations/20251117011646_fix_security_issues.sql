/*
  # Fix Security Issues
  
  1. Remove Unused Indexes
    - Drop idx_customers_phone (not being used in queries)
    - Drop idx_transactions_customer_id (not being used in queries)
    - Drop idx_transactions_created_at (not being used in queries)
  
  2. Fix Function Search Path
    - Add SECURITY DEFINER and search_path to update_customer_points function
    - Add SECURITY DEFINER and search_path to update_updated_at_column function
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_customers_phone;
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_created_at;

-- Recreate update_customer_points function with secure search_path
CREATE OR REPLACE FUNCTION update_customer_points()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE customers
  SET 
    total_points = total_points + NEW.points,
    updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$;

-- Recreate update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;