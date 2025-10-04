/*
  # Fix variant price to allow null values

  1. Changes
    - Alter `loyverse_variants.price` to allow null values
    - This handles cases where variants from Loyverse don't have pricing
  
  2. Security
    - No changes to RLS policies
*/

ALTER TABLE loyverse_variants ALTER COLUMN price DROP NOT NULL;