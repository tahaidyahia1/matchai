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

async function logAdminAction(
  supabase: any,
  adminId: string,
  action: string,
  targetType: string | null,
  targetId: string | null,
  details: any,
  ipAddress: string | null
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
    ip_address: ipAddress,
  });
}

async function verifyAdmin(supabase: any, adminId: string): Promise<boolean> {
  if (!adminId) return false;

  const { data } = await supabase
    .from('admin_users')
    .select('id, is_active')
    .eq('id', adminId)
    .eq('is_active', true)
    .maybeSingle();

  return !!data;
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

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const body = await req.json();
    const { action, adminId, adminEmail, password } = body;

    if (action === 'admin-signin') {
      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, is_active, password_hash')
        .eq('email', adminEmail)
        .maybeSingle();

      if (fetchError || !adminData) {
        throw new Error('Invalid email or password');
      }

      if (!adminData.is_active) {
        throw new Error('Account is disabled');
      }

      const isValid = await verifyPassword(password, adminData.password_hash);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);

      await logAdminAction(supabase, adminData.id, 'admin_signin', null, null, { email: adminEmail }, ipAddress);

      const admin = {
        id: adminData.id,
        email: adminData.email,
        full_name: adminData.full_name,
        role: adminData.role,
      };

      return new Response(
        JSON.stringify({ admin }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'get-all-customers') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { page = 1, limit = 50, search = '' } = body;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          phone,
          created_at,
          loyalty_points(
            total_points,
            lifetime_points,
            tier
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data: rawData, error, count } = await query;

      if (error) throw error;

      console.log('Raw customer data:', JSON.stringify(rawData, null, 2));

      const data = (rawData || []).map(user => {
        const loyaltyPoints = user.loyalty_points && Array.isArray(user.loyalty_points) && user.loyalty_points.length > 0
          ? user.loyalty_points
          : [{ total_points: 0, lifetime_points: 0, tier: 'Green Member' }];

        console.log(`User ${user.full_name} loyalty_points:`, loyaltyPoints);

        return {
          ...user,
          loyalty_points: loyaltyPoints
        };
      });

      console.log('Processed customer data:', JSON.stringify(data, null, 2));

      return new Response(
        JSON.stringify({ data, total: count, page, limit }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'adjust-points') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { userId, points, reason } = body;

      const { data: currentPoints, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('total_points, lifetime_points')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const newTotalPoints = Math.max(0, (currentPoints?.total_points || 0) + points);
      const newLifetimePoints = points > 0 
        ? (currentPoints?.lifetime_points || 0) + points
        : currentPoints?.lifetime_points || 0;

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
          tier: tier,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          points: points,
          transaction_type: 'adjustment',
          description: reason || `Admin adjustment: ${points > 0 ? '+' : ''}${points} points`,
        });

      if (transactionError) throw transactionError;

      await logAdminAction(
        supabase,
        adminId,
        'adjust_points',
        'user',
        userId,
        { points, reason, newTotalPoints },
        ipAddress
      );

      return new Response(
        JSON.stringify({ success: true, newTotalPoints, tier }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'get-customer-details') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { userId } = body;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          phone,
          created_at,
          loyalty_points(
            total_points,
            lifetime_points,
            tier,
            created_at
          )
        `)
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: transactions, error: transError } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transError) throw transError;

      const { data: redemptions, error: redError } = await supabase
        .from('redemptions')
        .select(`
          *,
          rewards_catalog(name, points_required)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (redError) throw redError;

      return new Response(
        JSON.stringify({
          user: userData,
          transactions,
          redemptions,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'create-reward') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { name, description, pointsRequired, category, imageUrl, stockQuantity } = body;

      const { data, error } = await supabase
        .from('rewards_catalog')
        .insert({
          name,
          description,
          points_required: pointsRequired,
          category,
          image_url: imageUrl,
          stock_quantity: stockQuantity,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        supabase,
        adminId,
        'create_reward',
        'reward',
        data.id,
        { name, pointsRequired },
        ipAddress
      );

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

    if (action === 'update-reward') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { rewardId, updates } = body;

      const { data, error } = await supabase
        .from('rewards_catalog')
        .update(updates)
        .eq('id', rewardId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        supabase,
        adminId,
        'update_reward',
        'reward',
        rewardId,
        { updates },
        ipAddress
      );

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

    if (action === 'get-all-rewards') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { includeInactive = false } = body;

      let query = supabase
        .from('rewards_catalog')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

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

    if (action === 'get-pending-redemptions') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          *,
          users(full_name, email, phone),
          rewards_catalog(name, points_required)
        `)
        .in('status', ['pending', 'approved'])
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

    if (action === 'update-redemption-status') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { redemptionId, status, notes } = body;

      const updates: any = { status, notes };
      
      if (status === 'approved') {
        updates.approved_by = adminId;
        updates.approved_at = new Date().toISOString();
      } else if (status === 'fulfilled') {
        updates.fulfilled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('redemptions')
        .update(updates)
        .eq('id', redemptionId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        supabase,
        adminId,
        'update_redemption',
        'redemption',
        redemptionId,
        { status, notes },
        ipAddress
      );

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

    if (action === 'create-promotion') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { name, description, type, value, minPurchase, startDate, endDate } = body;

      const { data, error } = await supabase
        .from('promotions')
        .insert({
          name,
          description,
          type,
          value,
          min_purchase: minPurchase,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        supabase,
        adminId,
        'create_promotion',
        'promotion',
        data.id,
        { name, type, value },
        ipAddress
      );

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

    if (action === 'get-all-promotions') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { includeInactive = false } = body;

      let query = supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

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

    if (action === 'update-promotion') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { promotionId, updates } = body;

      const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', promotionId)
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(
        supabase,
        adminId,
        'update_promotion',
        'promotion',
        promotionId,
        { updates },
        ipAddress
      );

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

    if (action === 'get-dashboard-stats') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { data: totalUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      const { data: totalPoints } = await supabase
        .from('loyalty_points')
        .select('total_points');

      const pointsSum = totalPoints?.reduce((sum, row) => sum + row.total_points, 0) || 0;

      const { data: pendingRedemptions } = await supabase
        .from('redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { data: tierDistribution } = await supabase
        .from('loyalty_points')
        .select('tier');

      const tiers = tierDistribution?.reduce((acc: any, row) => {
        acc[row.tier] = (acc[row.tier] || 0) + 1;
        return acc;
      }, {});

      return new Response(
        JSON.stringify({
          totalUsers: totalUsers || 0,
          totalPointsIssued: pointsSum,
          pendingRedemptions: pendingRedemptions || 0,
          tierDistribution: tiers || {},
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'get-audit-logs') {
      const isValidAdmin = await verifyAdmin(supabase, adminId);
      if (!isValidAdmin) {
        throw new Error('Admin authentication required');
      }

      const { page = 1, limit = 50 } = body;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('admin_audit_log')
        .select(`
          *,
          admin_users(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ data, total: count, page, limit }),
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
    console.error('Error in admin-operations function:', error);
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