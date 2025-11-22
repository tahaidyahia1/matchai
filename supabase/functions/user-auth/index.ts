import { createClient } from 'npm:@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { action, email, password, fullName, phone } = await req.json();

    if (action === 'signup') {
      console.log('Signup attempt for email:', email);

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      const passwordHash = await hashPassword(password);
      console.log('Password hashed successfully');

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

      if (userError) {
        console.error('User creation error:', userError);
        throw new Error(userError.message || 'Failed to create user');
      }

      console.log('User created:', newUser);

      const { error: loyaltyError } = await supabase
        .from('loyalty_points')
        .insert({
          user_id: newUser.id,
          total_points: 0,
          lifetime_points: 0,
          tier: 'Green Member'
        });

      if (loyaltyError) {
        console.error('Loyalty points creation error:', loyaltyError);
        throw new Error(loyaltyError.message || 'Failed to create loyalty points');
      }

      console.log('Loyalty points created for user:', newUser.id);

      return new Response(
        JSON.stringify({ user: newUser }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    } else if (action === 'signin') {
      console.log('Signin attempt for email:', email);

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, full_name, phone, password_hash')
        .eq('email', email)
        .maybeSingle();

      if (fetchError || !userData) {
        console.error('User fetch error:', fetchError);
        throw new Error('Invalid email or password');
      }

      const isValid = await verifyPassword(password, userData.password_hash);
      if (!isValid) {
        console.log('Invalid password for user:', email);
        throw new Error('Invalid email or password');
      }

      const user = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone
      };

      console.log('User signed in successfully:', email);

      return new Response(
        JSON.stringify({ user }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in user-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
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