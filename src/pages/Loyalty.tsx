import React, { useState, useEffect } from 'react';
import { Gift, Smartphone, Star, Coffee, Award, CreditCard, LogOut, History, ShoppingBag, Search } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { getPointsTransactions, lookupPointsByPhone } from '../services/loyaltyService';
import { getActiveRewards, redeemReward, getUserRedemptions, Reward, Redemption } from '../services/rewardsService';

interface Transaction {
  id: string;
  points: number;
  transaction_type: string;
  order_amount: number | null;
  description: string;
  created_at: string;
}

export default function Loyalty() {
  const { user, loyaltyData, signOut, refreshLoyaltyData } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLookupForm, setShowLookupForm] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState('');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userRedemptions, setUserRedemptions] = useState<Redemption[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [showRedemptions, setShowRedemptions] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redemptionMessage, setRedemptionMessage] = useState('');

  useEffect(() => {
    if (user && showTransactions) {
      loadTransactions();
    }
  }, [user, showTransactions]);

  const loadTransactions = async () => {
    if (user) {
      try {
        const data = await getPointsTransactions(user.id);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone) return;

    setIsProcessing(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const result = await lookupPointsByPhone(lookupPhone);
      setLookupResult(result);
    } catch (error: any) {
      setLookupError(error.message || 'Unable to find account with this phone number');
      console.error('Lookup error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadRewards = async () => {
    try {
      const data = await getActiveRewards();
      setRewards(data);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const loadUserRedemptions = async () => {
    if (user) {
      try {
        const data = await getUserRedemptions(user.id);
        setUserRedemptions(data);
      } catch (error) {
        console.error('Failed to load redemptions:', error);
      }
    }
  };

  useEffect(() => {
    if (user && showRewards) {
      loadRewards();
    }
  }, [user, showRewards]);

  useEffect(() => {
    if (user && showRedemptions) {
      loadUserRedemptions();
    }
  }, [user, showRedemptions]);

  const handleRedeemReward = async (reward: Reward) => {
    if (!user || !loyaltyData) return;

    if (loyaltyData.total_points < reward.points_required) {
      setRedemptionMessage(`You need ${reward.points_required} points but only have ${loyaltyData.total_points}`);
      return;
    }

    setIsProcessing(true);
    setRedemptionMessage('');

    try {
      const result = await redeemReward(user.id, reward.id);
      setRedemptionMessage(`Success! Your redemption code is: ${result.redemption.redemption_code}. Show this code at the store.`);
      setSelectedReward(null);
      await refreshLoyaltyData();
      await loadUserRedemptions();
    } catch (error: any) {
      setRedemptionMessage(error.message || 'Failed to redeem reward');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierColor = (tier: string) => {
    if (tier === 'Gold VIP') return 'from-yellow-50 to-yellow-100 border-yellow-300';
    if (tier === 'Silver Elite') return 'from-gray-50 to-gray-100 border-gray-300';
    return 'from-gray-50 to-white border-gray-200';
  };

  return (
    <div className="pt-16">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => refreshLoyaltyData()}
      />
      {user && loyaltyData && (
        <section className="py-12 bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.full_name}!</h2>
                <p className="text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className={`bg-gradient-to-br ${getTierColor(loyaltyData.tier)} rounded-2xl p-6 border-2`}>
                <div className="text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-gray-800" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{loyaltyData.total_points}</div>
                  <div className="text-sm text-gray-700">Current Points</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{loyaltyData.tier}</div>
                  <div className="text-sm text-gray-300">Your Tier</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <div className="text-center">
                  <Coffee className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{loyaltyData.lifetime_points}</div>
                  <div className="text-sm text-gray-300">Lifetime Points</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowRewards(!showRewards)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Gift className="h-4 w-4" />
                <span>{showRewards ? 'Hide' : 'Browse'} Rewards</span>
              </button>
              <button
                onClick={() => setShowRedemptions(!showRedemptions)}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Award className="h-4 w-4" />
                <span>{showRedemptions ? 'Hide' : 'My'} Redemptions</span>
              </button>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <History className="h-4 w-4" />
                <span>{showTransactions ? 'Hide' : 'View'} History</span>
              </button>
            </div>

            <div className="mt-6 bg-green-600 bg-opacity-20 border border-green-500 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <ShoppingBag className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">How to Earn Points</h3>
                  <p className="text-green-100 mb-3">
                    Visit our store in Agdal and make a purchase. Our staff will add points to your account automatically!
                  </p>
                  <div className="space-y-2 text-sm text-green-200">
                    <p>✓ 1 point for every 10 MAD spent</p>
                    <p>✓ Points appear instantly in your account</p>
                    <p>✓ No need to do anything - it's automatic!</p>
                  </div>
                </div>
              </div>
            </div>

            {showRewards && (
              <div className="mt-6 bg-white bg-opacity-10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Available Rewards</h3>
                {redemptionMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${redemptionMessage.includes('Success') ? 'bg-green-500 bg-opacity-20 text-green-100' : 'bg-red-500 bg-opacity-20 text-red-100'}`}>
                    {redemptionMessage}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="bg-white bg-opacity-10 rounded-xl p-4">
                      <h4 className="font-bold text-lg mb-2">{reward.name}</h4>
                      <p className="text-sm text-gray-300 mb-3">{reward.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">{reward.points_required} pts</span>
                        <button
                          onClick={() => setSelectedReward(reward)}
                          disabled={loyaltyData && loyaltyData.total_points < reward.points_required}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            loyaltyData && loyaltyData.total_points >= reward.points_required
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {loyaltyData && loyaltyData.total_points >= reward.points_required ? 'Redeem' : 'Not enough pts'}
                        </button>
                      </div>
                      {reward.stock_quantity !== null && (
                        <div className="mt-2 text-xs text-gray-400">
                          {reward.stock_quantity > 0 ? `${reward.stock_quantity} available` : 'Out of stock'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRedemptions && (
              <div className="mt-6 bg-white bg-opacity-10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">My Redemptions</h3>
                <div className="space-y-3">
                  {userRedemptions.length === 0 ? (
                    <p className="text-gray-300">No redemptions yet</p>
                  ) : (
                    userRedemptions.map((redemption) => (
                      <div key={redemption.id} className="bg-white bg-opacity-10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold">{redemption.rewards_catalog?.name}</div>
                            <div className="text-sm text-gray-300">
                              Code: <span className="font-mono bg-black bg-opacity-30 px-2 py-1 rounded">{redemption.redemption_code}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            redemption.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-200' :
                            redemption.status === 'approved' ? 'bg-blue-500 bg-opacity-20 text-blue-200' :
                            'bg-green-500 bg-opacity-20 text-green-200'
                          }`}>
                            {redemption.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(redemption.created_at).toLocaleDateString()} • {redemption.points_spent} points
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {showTransactions && transactions.length > 0 && (
              <div className="mt-6 bg-white bg-opacity-10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-white border-opacity-10">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-300">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReward && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Redemption</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to redeem <strong>{selectedReward.name}</strong> for{' '}
                    <strong>{selectedReward.points_required} points</strong>?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRedeemReward(selectedReward)}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setSelectedReward(null)}
                      className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {!user && (
        <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Check Your Points Balance
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Enter your phone number to view your loyalty points, tier status, and rewards.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-white bg-opacity-10 rounded-2xl p-8 mb-8">
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label htmlFor="lookupPhone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="lookupPhone"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    placeholder="e.g., 0612345678"
                    required
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="h-5 w-5" />
                  <span>{isProcessing ? 'Searching...' : 'Check Balance'}</span>
                </button>
                {lookupError && (
                  <p className="text-sm text-red-400">{lookupError}</p>
                )}
              </form>
            </div>

            {lookupResult && (
              <div className="max-w-2xl mx-auto bg-white bg-opacity-10 rounded-2xl p-8 mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{lookupResult.user.full_name}</h3>
                  <p className="text-gray-300">{lookupResult.user.email}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`bg-gradient-to-br ${getTierColor(lookupResult.loyalty.tier)} rounded-xl p-6 border-2`}>
                    <div className="text-center">
                      <Star className="h-8 w-8 mx-auto mb-2 text-gray-800" />
                      <div className="text-3xl font-bold text-gray-900 mb-1">{lookupResult.loyalty.total_points}</div>
                      <div className="text-sm text-gray-700">Current Points</div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-xl font-bold mb-1">{lookupResult.loyalty.tier}</div>
                      <div className="text-sm text-gray-300">Your Tier</div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-6">
                    <div className="text-center">
                      <Coffee className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-3xl font-bold mb-1">{lookupResult.loyalty.lifetime_points}</div>
                      <div className="text-sm text-gray-300">Lifetime Points</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-300 mb-4">Want to manage your account?</p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </section>
      )}

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

              <Button
                onClick={() =>
                  window.open(
                    'https://form.passquare.com/ap_6ba5bd1c75fad102fea3162030e5367eacd60d5c37a5ad44',
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
                    <div className="text-3xl font-bold mb-1">{user && loyaltyData ? loyaltyData.total_points : '150'}</div>
                    <div className="text-gray-300 text-sm">Points Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-300 text-xs">{user && loyaltyData ? loyaltyData.tier : 'Silver Elite Member'}</div>
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
