export async function addPointsForPurchase(userId: string, orderAmount: number) {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loyalty-operations`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'add-points',
      userId,
      orderAmount
    })
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result;
}

export async function getPointsTransactions(userId: string) {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loyalty-operations`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get-transactions',
      userId
    })
  });

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return result.data;
}
