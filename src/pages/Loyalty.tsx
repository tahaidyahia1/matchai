import React from 'react';
import { Gift, Smartphone, Star, Coffee, Award, CreditCard } from 'lucide-react';
import Button from '../components/Button';

export default function Loyalty() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="text-green-700 font-medium">Matchai Points Rewards</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Stay Elegant, Stay Rewarded
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Every sip brings you closer to rewards. Earn Matchai Points and unlock exclusive benefits.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How Matchai Points Work
            </h2>
            <p className="text-lg text-gray-600">Simple, elegant, and rewarding</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Earn Points</h3>
              <p className="text-gray-600">
                Earn 1 point for every 10 MAD spent on any matcha drink or product in our store.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Collect Rewards</h3>
              <p className="text-gray-600">
                Accumulate points and unlock exclusive rewards, discounts, and special offers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Redeem Benefits</h3>
              <p className="text-gray-600">
                Use your points for free drinks, exclusive menu items, and VIP experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Rewards Tiers
            </h2>
            <p className="text-lg text-gray-600">The more you visit, the more you earn</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Green Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 w-3 h-3 bg-gray-400 rounded-full" />
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Green Member</h3>
                <p className="text-gray-600">0-99 Points</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Earn 1 point per 10 MAD
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Birthday reward
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Mobile app access
                </li>
              </ul>
            </div>

            {/* Silver Tier */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative border-2 border-gray-300">
              <div className="absolute top-4 right-4 w-3 h-3 bg-gray-400 rounded-full" />
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Silver Elite</h3>
                <p className="text-gray-600">100-199 Points</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  All Green benefits
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  1.5x points on Sundays
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Free size upgrade monthly
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Early access to new drinks
                </li>
              </ul>
            </div>

            {/* Gold Tier */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 shadow-md relative border-2 border-yellow-300">
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Gold VIP</h3>
                <p className="text-gray-600">200+ Points</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  All Silver benefits
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  2x points every visit
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Free drink every 10 visits
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  VIP tasting events
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-black rounded-full mr-3" />
                  Personalized recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Apple Wallet Integration */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Add to Apple Wallet
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Keep your Matchai Points card in your Apple Wallet for easy access and automatic updates.
                Never miss a point or reward again.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full" />
                  <span className="text-gray-700">Automatic point balance updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full" />
                  <span className="text-gray-700">Push notifications for rewards</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-black rounded-full" />
                  <span className="text-gray-700">Quick access at checkout</span>
                </div>
              </div>

              {/* Only the external link button remains */}
              <Button
                onClick={() =>
                  window.open(
                    'https://form.passquare.com/f0a1baeb-e149-4ab0-af16-7374c3bb54af',
                    '_blank'
                  )
                }
                icon={CreditCard}
              >
                Add to your Wallet
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden flex items-center justify-center">
                <div className="w-48 h-80 bg-gradient-to-br from-gray-800 to-black rounded-2xl shadow-2xl flex flex-col items-center justify-between p-6 text-white">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div className="text-xl font-bold">Matchai Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">150</div>
                    <div className="text-gray-300 text-sm">Points Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-300 text-xs">Silver Elite Member</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Earning Today
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Visit our store in Agdal to get your Matchai Points card and start earning rewards with every purchase.
          </p>
          <div className="space-x-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open('https://maps.app.goo.gl/Y5gkcyyNVbcjmMHQ8', '_blank')}
            >
              Visit Our Store
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
