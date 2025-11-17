import React, { useState, useEffect } from 'react';
import { supabase, Customer, Transaction } from '../lib/supabase';
import { Plus, Minus, Search, Download, User, Phone, Mail, TrendingUp } from 'lucide-react';

export default function LoyaltyAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [pointsTransaction, setPointsTransaction] = useState({
    points: '',
    description: '',
    type: 'purchase' as const
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      loadTransactions(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email || null
        }])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCustomers([data, ...customers]);
      }
      setNewCustomer({ name: '', phone: '', email: '' });
      setShowAddCustomer(false);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer. Please check if phone number is unique.');
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const pointsValue = parseInt(pointsTransaction.points);
      if (isNaN(pointsValue)) {
        alert('Please enter a valid number');
        return;
      }

      const { error } = await supabase
        .from('transactions')
        .insert([{
          customer_id: selectedCustomer.id,
          points: pointsValue,
          description: pointsTransaction.description || null,
          transaction_type: pointsTransaction.type
        }]);

      if (error) throw error;

      await loadCustomers();
      const updatedCustomer = customers.find(c => c.id === selectedCustomer.id);
      if (updatedCustomer) {
        setSelectedCustomer(updatedCustomer);
      }
      await loadTransactions(selectedCustomer.id);

      setPointsTransaction({ points: '', description: '', type: 'purchase' });
      setShowAddPoints(false);
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Error adding points');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Total Points', 'Registered Date'],
      ...customers.map(c => [
        c.name,
        c.phone,
        c.email || '',
        c.total_points,
        new Date(c.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matchai-loyalty-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const totalPoints = customers.reduce((sum, c) => sum + c.total_points, 0);
  const averagePoints = customers.length > 0 ? Math.round(totalPoints / customers.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matchai Loyalty Program</h1>
          <p className="text-gray-600">Manage customer points and rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <User className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points Issued</p>
                <p className="text-3xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Points</p>
                <p className="text-3xl font-bold text-gray-900">{averagePoints}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={() => setShowAddCustomer(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Customer
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No customers found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedCustomer?.id === customer.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </span>
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {customer.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {customer.total_points}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCustomer ? `${selectedCustomer.name}'s Activity` : 'Select a Customer'}
                </h2>
                {selectedCustomer && (
                  <button
                    onClick={() => setShowAddPoints(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Points
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {!selectedCustomer ? (
                <div className="p-8 text-center text-gray-500">
                  Select a customer to view their transaction history
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No transactions yet
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.transaction_type === 'purchase' ? 'bg-green-100 text-green-800' :
                              transaction.transaction_type === 'reward' ? 'bg-blue-100 text-blue-800' :
                              transaction.transaction_type === 'redemption' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.transaction_type}
                            </span>
                          </div>
                          {transaction.description && (
                            <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddPoints && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Add Points for {selectedCustomer.name}
            </h3>
            <form onSubmit={handleAddPoints}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points *
                  </label>
                  <input
                    type="number"
                    required
                    value={pointsTransaction.points}
                    onChange={(e) => setPointsTransaction({ ...pointsTransaction, points: e.target.value })}
                    placeholder="Enter positive or negative number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use negative numbers to subtract points</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type *
                  </label>
                  <select
                    value={pointsTransaction.type}
                    onChange={(e) => setPointsTransaction({ ...pointsTransaction, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="purchase">Purchase</option>
                    <option value="reward">Reward</option>
                    <option value="redemption">Redemption</option>
                    <option value="adjustment">Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={pointsTransaction.description}
                    onChange={(e) => setPointsTransaction({ ...pointsTransaction, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPoints(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
