import { createClient } from 'npm:@supabase/supabase-js@2.84.0';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, password, fullName, phone } = await req.json();

    if (action === 'signup') {
      const passwordHash = await bcrypt.hash(password);

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: passwordHash,
          full_name: fullName,
          phone: phone || null
        })
        .select('id, email, full_name, phone')
        .single();

      if (userError) throw userError;

      const { error: loyaltyError } = await supabase
        .from('loyalty_points')
        .insert({
          user_id: newUser.id,
          total_points: 0,
          lifetime_points: 0,
          tier: 'Green Member'
        });

      if (loyaltyError) throw loyaltyError;

      return new Response(
        JSON.stringify({ user: newUser }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    } else if (action === 'signin') {
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, full_name, phone, password_hash')
        .eq('email', email)
        .maybeSingle();

      if (fetchError || !userData) {
        throw new Error('Invalid email or password');
      }

      const isValid = await bcrypt.compare(password, userData.password_hash);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      const user = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone
      };

      return new Response(
        JSON.stringify({ user }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});