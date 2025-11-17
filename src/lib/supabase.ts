import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  customer_id: string;
  points: number;
  description: string | null;
  transaction_type: 'purchase' | 'reward' | 'redemption' | 'adjustment';
  created_at: string;
  created_by: string | null;
};
