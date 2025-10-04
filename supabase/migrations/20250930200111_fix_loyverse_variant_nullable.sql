/*
  # Fix variant_name to allow null values

  1. Changes
    - Alter `loyverse_variants.variant_name` to allow null values
    - This handles cases where variants from Loyverse don't have names
  
  2. Security
    - No changes to RLS policies
*/

ALTER TABLE loyverse_variants ALTER COLUMN variant_name DROP NOT NULL;