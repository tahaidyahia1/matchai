import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Star,
  Gift,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Check,
  X,
  LogOut,
  Award,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';
import Button from '../components/Button';
import { useAdmin } from '../context/AdminContext';
import {
  getDashboardStats,
  getAllCustomers,
  adjustPoints,
  getAllRewards,
  createReward,
  updateReward,
  getPendingRedemptions,
  updateRedemptionStatus,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  Customer,
  DashboardStats,
} from '../services/adminService';

type Tab = 'overview' | 'customers' | 'rewards' | 'redemptions' | 'promotions';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, signOut } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [rewards, setRewards] = useState<any[]>([]);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [showPromotionForm, setShowPromotionForm] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [admin, navigate]);

  const loadDashboardData = async () => {
    try {
      const [statsData, customersData] = await Promise.all([
        getDashboardStats(),
        getAllCustomers(),
      ]);
      setStats(statsData);
      setCustomers(customersData.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadRewards = async () => {
    try {
      const data = await getAllRewards(true);
      setRewards(data);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const loadRedemptions = async () => {
    try {
      const data = await getPendingRedemptions();
      setRedemptions(data);
    } catch (error) {
      console.error('Failed to load redemptions:', error);
    }
  };

  const loadPromotions = async () => {
    try {
      const data = await getAllPromotions(true);
      setPromotions(data);
    } catch (error) {
      console.error('Failed to load promotions:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'rewards') {
      loadRewards();
    } else if (activeTab === 'redemptions') {
      loadRedemptions();
    } else if (activeTab === 'promotions') {
      loadPromotions();
    }
  }, [activeTab]);

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setIsLoading(true);
    setMessage('');

    try {
      const purchaseAmount = parseFloat(pointsAdjustment);
      const points = Math.floor(purchaseAmount / 10);

      await adjustPoints(selectedCustomer.id, points, adjustmentReason || `Purchase: ${purchaseAmount} MAD`);
      setMessage(`Successfully added ${points} points for ${purchaseAmount} MAD purchase`);
      setPointsAdjustment('');
      setAdjustmentReason('');
      setSelectedCustomer(null);
      await loadDashboardData();
    } catch (error: any) {
      setMessage(error.message || 'Failed to add points');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRedemption = async (redemptionId: string) => {
    try {
      await updateRedemptionStatus(redemptionId, 'approved');
      setMessage('Redemption approved successfully');
      await loadRedemptions();
    } catch (error: any) {
      setMessage(error.message || 'Failed to approve redemption');
    }
  };

  const handleFulfillRedemption = async (redemptionId: string) => {
    try {
      await updateRedemptionStatus(redemptionId, 'fulfilled');
      setMessage('Redemption marked as fulfilled');
      await loadRedemptions();
    } catch (error: any) {
      setMessage(error.message || 'Failed to fulfill redemption');
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
  );

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Matchai Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {admin.full_name}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              icon={LogOut}
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'redemptions', label: 'Redemptions', icon: Award },
            { id: 'promotions', label: 'Promotions', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            {message}
          </div>
        )}

        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Customers</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.totalPointsIssued.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Points Issued</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Gift className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stats.pendingRedemptions}
                </div>
                <div className="text-sm text-gray-600">Pending Redemptions</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-sm text-gray-600 mb-2">Tier Distribution</div>
                <div className="space-y-1 text-xs">
                  <div>Green: {stats.tierDistribution['Green Member'] || 0}</div>
                  <div>Silver: {stats.tierDistribution['Silver Elite'] || 0}</div>
                  <div>Gold: {stats.tierDistribution['Gold VIP'] || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-800">{customer.full_name}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          {customer.loyalty_points?.[0]?.total_points || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {customer.loyalty_points?.[0]?.tier || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Add Purchase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedCustomer && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Add Points for {selectedCustomer.full_name}
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>For purchases:</strong> Enter purchase amount in MAD. System calculates 1 point per 10 MAD automatically.
                    </p>
                  </div>
                  <form onSubmit={handleAdjustPoints} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Amount (MAD)
                      </label>
                      <input
                        type="number"
                        value={pointsAdjustment}
                        onChange={(e) => {
                          const amount = e.target.value;
                          setPointsAdjustment(amount);
                          if (amount) {
                            const points = Math.floor(parseFloat(amount) / 10);
                            setAdjustmentReason(`Purchase: ${amount} MAD = ${points} points`);
                          }
                        }}
                        placeholder="e.g., 150 (for 150 MAD purchase)"
                        required
                        min="1"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the total purchase amount. Points will be calculated automatically (1 point per 10 MAD).
                      </p>
                      {pointsAdjustment && (
                        <p className="text-sm font-medium text-green-600 mt-2">
                          Customer will earn: {Math.floor(parseFloat(pointsAdjustment) / 10)} points
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                        placeholder="Add any additional notes..."
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? 'Processing...' : 'Confirm'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedCustomer(null);
                          setPointsAdjustment('');
                          setAdjustmentReason('');
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rewards Catalog</h2>
              <Button onClick={() => setShowRewardForm(true)} icon={Plus}>
                Add New Reward
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-800">{reward.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reward.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {reward.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      {reward.points_required} pts
                    </span>
                    <span className="text-sm text-gray-600">{reward.category}</span>
                  </div>
                  {reward.stock_quantity !== null && (
                    <div className="mt-2 text-sm text-gray-600">
                      Stock: {reward.stock_quantity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'redemptions' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Redemptions</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {redemptions.map((redemption) => (
                    <tr key={redemption.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-800">
                            {redemption.users?.full_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {redemption.users?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {redemption.rewards_catalog?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {redemption.points_spent} points
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {redemption.redemption_code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            redemption.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : redemption.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {redemption.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(redemption.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {redemption.status === 'pending' && (
                            <button
                              onClick={() => handleApproveRedemption(redemption.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          {redemption.status === 'approved' && (
                            <button
                              onClick={() => handleFulfillRedemption(redemption.id)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Mark as Fulfilled"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Promotions</h2>
              <Button onClick={() => setShowPromotionForm(true)} icon={Plus}>
                Create Promotion
              </Button>
            </div>

            <div className="space-y-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{promo.name}</h3>
                      <p className="text-gray-600 mt-1">{promo.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span>Type: {promo.type}</span>
                        <span>Value: {promo.value}</span>
                        <span>
                          {new Date(promo.start_date).toLocaleDateString()} -{' '}
                          {new Date(promo.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        promo.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
