/*
  # Fix price column to allow null values

  1. Changes
    - Alter `loyverse_items.price` to allow null values
    - This handles cases where items from Loyverse don't have pricing set up yet
  
  2. Security
    - No changes to RLS policies
*/

ALTER TABLE loyverse_items ALTER COLUMN price DROP NOT NULL;