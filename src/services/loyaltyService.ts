import { supabase } from '../lib/supabase';

export async function addPointsForPurchase(userId: string, orderAmount: number) {
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

  return { pointsEarned, newTotalPoints, tier };
}

export async function getPointsTransactions(userId: string) {
  const { data, error } = await supabase
    .from('points_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
