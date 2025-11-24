const API_URL = import.meta.env.VITE_SUPABASE_URL;

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  stock_quantity: number | null;
  created_at: string;
}

export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: string;
  redemption_code: string;
  approved_at: string | null;
  fulfilled_at: string | null;
  notes: string | null;
  created_at: string;
  rewards_catalog?: Reward;
}

export async function getActiveRewards(): Promise<Reward[]> {
  const response = await fetch(`${API_URL}/functions/v1/rewards-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get-active-rewards',
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function redeemReward(
  userId: string,
  rewardId: string
): Promise<{ redemption: Redemption; newTotalPoints: number; tier: string }> {
  const response = await fetch(`${API_URL}/functions/v1/rewards-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'redeem-reward',
      userId,
      rewardId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function getUserRedemptions(userId: string): Promise<Redemption[]> {
  const response = await fetch(`${API_URL}/functions/v1/rewards-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get-user-redemptions',
      userId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}
