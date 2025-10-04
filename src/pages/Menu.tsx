import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { supabase, LoyverseItem, LoyverseCategory } from '../lib/supabase';
import type { MenuItem } from '../types';

export default function Menu() {
  const { dispatch } = useCart();
  const [items, setItems] = useState<LoyverseItem[]>([]);
  const [categories, setCategories] = useState<LoyverseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [itemsResponse, categoriesResponse] = await Promise.all([
        supabase.from('loyverse_items').select('*').eq('available', true),
        supabase.from('loyverse_categories').select('*'),
      ]);

      if (itemsResponse.error) throw itemsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setItems(itemsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError('Failed to load menu. Please try syncing with Loyverse.');
    } finally {
      setLoading(false);
    }
  };

  const syncWithLoyverse = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-loyverse`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to sync with Loyverse');
      }

      await fetchMenuData();
    } catch (err) {
      console.error('Error syncing with Loyverse:', err);
      setError('Failed to sync with Loyverse. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const addToCart = (item: LoyverseItem, size: 'small' | 'big') => {
    const basePrice = item.price || 35;
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      description: item.description || '',
      prices: {
        small: basePrice * 0.8,
        big: basePrice,
      },
      category: 'drink',
    };
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, size } });
    dispatch({ type: 'OPEN_CART' });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Our Menu
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-6">
            Discover our carefully crafted matcha specialties, each one a perfect balance of tradition and innovation
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={syncWithLoyverse}
            disabled={syncing || loading}
            icon={RefreshCw}
            className={syncing ? 'animate-spin' : ''}
          >
            {syncing ? 'Syncing...' : 'Sync with Loyverse'}
          </Button>
          {error && (
            <p className="mt-4 text-red-600 text-sm">{error}</p>
          )}
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Specialties</h2>
            <p className="text-lg text-gray-600">Each drink is crafted with premium Japanese matcha and the finest ingredients</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
              <p className="mt-4 text-gray-600">Loading menu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 mb-4">No items found. Please sync with Loyverse to load your menu.</p>
              <Button
                variant="primary"
                onClick={syncWithLoyverse}
                disabled={syncing}
              >
                Sync Now
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl font-bold">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gray-900/20"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-6">{item.description || 'Delicious matcha specialty'}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Small</span>
                          <span className="text-lg font-bold text-black">
                            {((item.price || 35) * 0.8).toFixed(2)} MAD
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item, 'small')}
                          icon={Plus}
                        >
                          Add
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Large</span>
                          <span className="text-lg font-bold text-black">
                            {(item.price || 35).toFixed(2)} MAD
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item, 'big')}
                          icon={Plus}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Experience the perfect blend of tradition and innovation with our premium matcha drinks
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            View Menu Again
          </Button>
        </div>
      </section>
    </div>
  );
}