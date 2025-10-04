import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LoyverseCategory {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoyverseItem {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price: number;
  cost: number | null;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyverseVariant {
  id: string;
  item_id: string;
  variant_name: string;
  price: number;
  sku: string | null;
  created_at: string;
  updated_at: string;
}
