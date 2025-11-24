import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { menuItems } from '../data/menu';
import type { MenuItem } from '../types';

export default function Menu() {
  const { dispatch } = useCart();

  const addToCart = (item: MenuItem, size: 'small' | 'big') => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem: item, size } });
    dispatch({ type: 'OPEN_CART' });
  };

  return (
    <div className="pt-16 bg-cream-50">
      <section className="py-24 bg-gradient-to-br from-cream-100 via-white to-matcha-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-matcha-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream-300/40 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-matcha-200/50 mb-8 animate-slide-up">
            <Sparkles className="h-4 w-4 text-matcha-600" />
            <span className="text-sm font-medium text-charcoal-700">Ceremonially Crafted</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-charcoal-950 mb-8 animate-fade-in">
            Our Menu
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-600 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Each creation harmoniously blends Japanese matcha tradition with innovative flavor profiles
          </p>
        </div>
      </section>

      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-20 text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal-950 mb-6">Signature Creations</h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto font-light">Every beverage is meticulously prepared with ceremonial-grade Japanese matcha and premium ingredients</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {menuItems.map((item, index) => (
              <div key={item.id} className="group animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-white rounded-3xl premium-shadow hover-lift overflow-hidden border border-cream-200">
                  <div className="aspect-[16/12] bg-gradient-to-br from-matcha-100 to-cream-200 relative overflow-hidden">
                    {item.id === 'rouge-cloud' ? (
                      <img
                        src="https://images.pexels.com/photos/5946637/pexels-photo-5946637.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : item.id === 'banana-flame' ? (
                      <img
                        src="https://images.pexels.com/photos/5946075/pexels-photo-5946075.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-full flex items-center justify-center">
                          <span className="text-5xl font-display font-bold text-white">{item.name.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="text-xs font-semibold text-matcha-700">Best Seller</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-3xl font-display font-bold text-charcoal-950 mb-3">{item.name}</h3>
                    <p className="text-charcoal-600 mb-8 leading-relaxed font-light">{item.description}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-200 hover:border-matcha-300 transition-colors">
                        <div>
                          <span className="text-sm font-medium text-charcoal-500 block mb-1">Small</span>
                          <span className="text-2xl font-bold text-charcoal-950">
                            {item.prices.small.toFixed(2)} <span className="text-base text-charcoal-600">MAD</span>
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

                      <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-cream-200 hover:border-matcha-300 transition-colors">
                        <div>
                          <span className="text-sm font-medium text-charcoal-500 block mb-1">Large</span>
                          <span className="text-2xl font-bold text-charcoal-950">
                            {item.prices.big.toFixed(2)} <span className="text-base text-charcoal-600">MAD</span>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-matcha-600 to-matcha-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
            Craving Matcha?
          </h2>
          <p className="text-xl md:text-2xl text-matcha-50 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Visit us in Agdal or place your order for pickup
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              View Menu Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-matcha-700"
              onClick={() => window.location.href = '/contact'}
            >
              Visit Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}