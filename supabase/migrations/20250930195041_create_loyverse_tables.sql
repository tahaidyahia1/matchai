/*
  # Create Loyverse Integration Tables

  1. New Tables
    - `loyverse_categories`
      - `id` (text, primary key) - Loyverse category ID
      - `name` (text) - Category name
      - `color` (text) - Category color
      - `created_at` (timestamptz) - Timestamp
      - `updated_at` (timestamptz) - Last sync timestamp
    
    - `loyverse_items`
      - `id` (text, primary key) - Loyverse item ID
      - `name` (text) - Item name
      - `description` (text) - Item description
      - `category_id` (text) - Foreign key to categories
      - `price` (numeric) - Item price
      - `cost` (numeric) - Item cost
      - `image_url` (text) - Item image URL
      - `available` (boolean) - Whether item is available
      - `created_at` (timestamptz) - Timestamp
      - `updated_at` (timestamptz) - Last sync timestamp
    
    - `loyverse_variants`
      - `id` (text, primary key) - Loyverse variant ID
      - `item_id` (text) - Foreign key to items
      - `variant_name` (text) - Variant name
      - `price` (numeric) - Variant price
      - `sku` (text) - SKU code
      - `created_at` (timestamptz) - Timestamp
      - `updated_at` (timestamptz) - Last sync timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (menu display)
    - No write policies (only Edge Functions will write via service role)

  3. Important Notes
    - Tables store synced data from Loyverse API
    - Data refreshed via Edge Function calls
    - Public read access allows menu display without authentication
*/

CREATE TABLE IF NOT EXISTS loyverse_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loyverse_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  category_id text REFERENCES loyverse_categories(id) ON DELETE SET NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  cost numeric(10, 2) DEFAULT 0,
  image_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loyverse_variants (
  id text PRIMARY KEY,
  item_id text REFERENCES loyverse_items(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  sku text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loyverse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyverse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyverse_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON loyverse_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view items"
  ON loyverse_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view variants"
  ON loyverse_variants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_items_category ON loyverse_items(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_item ON loyverse_variants(item_id);