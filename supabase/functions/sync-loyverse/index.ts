import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const LOYVERSE_API_TOKEN = '0ccd896034e14d968527098c4105e452';
const LOYVERSE_API_BASE = 'https://api.loyverse.com/v1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LoyverseCategory {
  id: string;
  name: string;
  color?: string;
}

interface LoyverseVariant {
  variant_id: string;
  variant_name: string;
  price: number;
  sku?: string;
}

interface LoyverseItem {
  id: string;
  item_name: string;
  description?: string;
  category_id?: string;
  primary_variant?: LoyverseVariant;
  variants?: LoyverseVariant[];
  images?: Array<{ url: string }>;
  is_sold_by_weight?: boolean;
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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching categories from Loyverse...');
    const categoriesResponse = await fetch(`${LOYVERSE_API_BASE}/categories`, {
      headers: {
        'Authorization': `Bearer ${LOYVERSE_API_TOKEN}`,
      },
    });

    if (!categoriesResponse.ok) {
      throw new Error(`Loyverse API error: ${categoriesResponse.status}`);
    }

    const categoriesData = await categoriesResponse.json();
    const categories: LoyverseCategory[] = categoriesData.categories || [];

    console.log('Fetching items from Loyverse...');
    const itemsResponse = await fetch(`${LOYVERSE_API_BASE}/items`, {
      headers: {
        'Authorization': `Bearer ${LOYVERSE_API_TOKEN}`,
      },
    });

    if (!itemsResponse.ok) {
      throw new Error(`Loyverse API error: ${itemsResponse.status}`);
    }

    const itemsData = await itemsResponse.json();
    const items: LoyverseItem[] = itemsData.items || [];

    console.log('Categories data:', JSON.stringify(categories));
    console.log('Items data sample:', JSON.stringify(items.slice(0, 2)));

    console.log(`Syncing ${categories.length} categories...`);
    for (const category of categories) {
      const { error: categoryError } = await supabase
        .from('loyverse_categories')
        .upsert({
          id: category.id,
          name: category.name,
          color: category.color,
          updated_at: new Date().toISOString(),
        });

      if (categoryError) {
        console.error('Error upserting category:', categoryError);
        throw categoryError;
      }
    }

    console.log(`Syncing ${items.length} items...`);
    for (const item of items) {
      const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : null;

      const price = item.primary_variant?.price
        ? item.primary_variant.price / 100
        : (item.variants && item.variants.length > 0 ? item.variants[0].price / 100 : 0);

      const { error: itemError } = await supabase
        .from('loyverse_items')
        .upsert({
          id: item.id,
          name: item.item_name,
          description: item.description || '',
          category_id: item.category_id,
          price: price,
          image_url: imageUrl,
          available: true,
          updated_at: new Date().toISOString(),
        });

      if (itemError) {
        console.error('Error upserting item:', itemError);
        throw itemError;
      }

      if (item.variants && item.variants.length > 0) {
        for (const variant of item.variants) {
          const { error: variantError } = await supabase
            .from('loyverse_variants')
            .upsert({
              id: variant.variant_id,
              item_id: item.id,
              variant_name: variant.variant_name,
              price: variant.price / 100,
              sku: variant.sku,
              updated_at: new Date().toISOString(),
            });

          if (variantError) {
            console.error('Error upserting variant:', variantError);
            throw variantError;
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${categories.length} categories and ${items.length} items`,
        categories: categories.length,
        items: items.length,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error syncing Loyverse data:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});