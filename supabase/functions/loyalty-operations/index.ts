import { createClient } from 'npm:@supabase/supabase-js@2.84.0';

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

    const { action, userId, orderAmount, phone } = await req.json();

    if (action === 'add-points') {
      const pointsEarned = Math.floor(orderAmount / 10);

      const { data: currentPoints, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('total_points, lifetime_points')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const newTotalPoints = (currentPoints?.total_points || 0) + pointsEarned;
      const newLifetimePoints = (currentPoints?.lifetime_points || 0) + pointsEarned;

      let tier = 'Green Member';
      if (newTotalPoints >= 200) {
        tier = 'Gold VIP';
      } else if (newTotalPoints >= 100) {
        tier = 'Silver Elite';
      }

      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({
          total_points: newTotalPoints,
          lifetime_points: newLifetimePoints,
          tier: tier
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          points: pointsEarned,
          transaction_type: 'purchase',
          order_amount: orderAmount,
          description: `Earned ${pointsEarned} points from ${orderAmount} MAD purchase`
        });

      if (transactionError) throw transactionError;

      return new Response(
        JSON.stringify({ pointsEarned, newTotalPoints, tier }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    } else if (action === 'get-loyalty-data') {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('total_points, lifetime_points, tier')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    } else if (action === 'get-transactions') {
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    } else if (action === 'lookup-by-phone') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('phone', phone)
        .maybeSingle();

      if (userError || !userData) {
        throw new Error('No account found with this phone number');
      }

      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('total_points, lifetime_points, tier')
        .eq('user_id', userData.id)
        .maybeSingle();

      if (loyaltyError) throw loyaltyError;

      return new Response(
        JSON.stringify({
          data: {
            user: userData,
            loyalty: loyaltyData
          }
        }),
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