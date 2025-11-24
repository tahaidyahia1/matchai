import { createClient } from 'npm:@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, userId, rewardId } = await req.json();

    if (action === 'get-active-rewards') {
      const { data, error } = await supabase
        .from('rewards_catalog')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'redeem-reward') {
      const { data: reward, error: rewardError } = await supabase
        .from('rewards_catalog')
        .select('*')
        .eq('id', rewardId)
        .eq('is_active', true)
        .maybeSingle();

      if (rewardError || !reward) {
        throw new Error('Reward not found or is no longer available');
      }

      if (reward.stock_quantity !== null && reward.stock_quantity <= 0) {
        throw new Error('This reward is out of stock');
      }

      const { data: userPoints, error: pointsError } = await supabase
        .from('loyalty_points')
        .select('total_points, lifetime_points')
        .eq('user_id', userId)
        .maybeSingle();

      if (pointsError || !userPoints) {
        throw new Error('Unable to fetch user points');
      }

      if (userPoints.total_points < reward.points_required) {
        throw new Error(`Insufficient points. You need ${reward.points_required} points but have ${userPoints.total_points}`);
      }

      const redemptionCode = generateRedemptionCode();

      const { data: redemption, error: redemptionError } = await supabase
        .from('redemptions')
        .insert({
          user_id: userId,
          reward_id: rewardId,
          points_spent: reward.points_required,
          status: 'pending',
          redemption_code: redemptionCode,
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      const newTotalPoints = userPoints.total_points - reward.points_required;
      
      let tier = 'Green Member';
      if (newTotalPoints >= 200) {
        tier = 'Gold VIP';
      } else if (newTotalPoints >= 100) {
        tier = 'Silver Elite';
      }

      const { error: updatePointsError } = await supabase
        .from('loyalty_points')
        .update({
          total_points: newTotalPoints,
          tier: tier,
        })
        .eq('user_id', userId);

      if (updatePointsError) throw updatePointsError;

      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          points: -reward.points_required,
          transaction_type: 'redeem',
          description: `Redeemed: ${reward.name}`,
        });

      if (transactionError) throw transactionError;

      if (reward.stock_quantity !== null) {
        await supabase
          .from('rewards_catalog')
          .update({ stock_quantity: reward.stock_quantity - 1 })
          .eq('id', rewardId);
      }

      return new Response(
        JSON.stringify({
          success: true,
          redemption,
          newTotalPoints,
          tier,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'get-user-redemptions') {
      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          *,
          rewards_catalog(name, description, points_required, category, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ data }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in rewards-operations function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});