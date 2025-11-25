const API_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  loyalty_points: {
    total_points: number;
    lifetime_points: number;
    tier: string;
  }[];
}

export interface DashboardStats {
  totalUsers: number;
  totalPointsIssued: number;
  pendingRedemptions: number;
  tierDistribution: Record<string, number>;
}

export async function adminSignIn(email: string, password: string): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'admin-signin',
      adminEmail: email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sign in');
  }

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.admin;
}

export async function getAllCustomers(
  page: number = 1,
  limit: number = 50,
  search: string = ''
): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-all-customers',
      adminId,
      page,
      limit,
      search,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function adjustPoints(
  userId: string,
  points: number,
  reason: string
): Promise<{ newTotalPoints: number; tier: string }> {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'adjust-points',
      adminId,
      userId,
      points,
      reason,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function getCustomerDetails(userId: string) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-customer-details',
      adminId,
      userId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-dashboard-stats',
      adminId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function getAllRewards(includeInactive: boolean = false) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-all-rewards',
      adminId,
      includeInactive,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function createReward(rewardData: {
  name: string;
  description: string;
  pointsRequired: number;
  category: string;
  imageUrl?: string;
  stockQuantity?: number;
}) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'create-reward',
      adminId,
      ...rewardData,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function updateReward(rewardId: string, updates: any) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'update-reward',
      adminId,
      rewardId,
      updates,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function getPendingRedemptions() {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-pending-redemptions',
      adminId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function updateRedemptionStatus(
  redemptionId: string,
  status: string,
  notes?: string
) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'update-redemption-status',
      adminId,
      redemptionId,
      status,
      notes,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function getAllPromotions(includeInactive: boolean = false) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-all-promotions',
      adminId,
      includeInactive,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function createPromotion(promotionData: {
  name: string;
  description: string;
  type: string;
  value: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
}) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'create-promotion',
      adminId,
      ...promotionData,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function updatePromotion(promotionId: string, updates: any) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'update-promotion',
      adminId,
      promotionId,
      updates,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}

export async function getAuditLogs(page: number = 1, limit: number = 50) {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'get-audit-logs',
      adminId,
      page,
      limit,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function deleteCustomer(userId: string): Promise<void> {
  const adminId = localStorage.getItem('adminId');

  const response = await fetch(`${API_URL}/functions/v1/admin-operations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      action: 'delete-customer',
      adminId,
      userId,
    }),
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);
}
