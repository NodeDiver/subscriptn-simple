"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import PaymentHistory from '@/components/PaymentHistory';

export default function ShopView({ params }: { params: Promise<{ shopId: string }> }) {
  const { user, logout } = useAuth();
  const [shop, setShop] = useState<{
    id: number;
    name: string;
    server_name: string;
    subscription_status: string;
    lightning_address?: string;
  } | null>(null);
  const [subscriptions, setSubscriptions] = useState<Array<{
    id: number;
    amount_sats: number;
    interval: string;
    status: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



  const handleLogout = async () => {
    await logout();
  };

  // Handle cancel subscription
  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        console.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  // Handle remove shop
  const handleRemoveShop = async (shopId: number) => {
    const warningMessage = `Are you sure you want to remove this shop?\n\nWARNING: This will also:\n• Cancel all active subscriptions\n• Stop recurring payments to the BTCPay Server owner\n• Permanently delete all subscription history\n\nThis action cannot be undone.`;
    
    if (!confirm(warningMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/shops?id=${shopId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to shops dashboard
        window.location.href = '/shops';
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove shop');
      }
    } catch (error) {
      console.error('Error removing shop:', error);
      alert('Failed to remove shop');
    }
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const { shopId: resolvedShopId } = await params;
        
        // Fetch shop details
        const shopResponse = await fetch(`/api/shops/${resolvedShopId}`);
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          setShop(shopData.shop);
        }

        // Fetch subscriptions for this shop
        const subscriptionsResponse = await fetch(`/api/shops/${resolvedShopId}/subscriptions`);
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          setSubscriptions(subscriptionsData.subscriptions);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setError('Failed to fetch shop data');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [params]);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link 
                href="/shops"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
              >
                ← Back to My Shops
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {shop ? shop.name : 'Shop Details'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading shop data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400 py-8">
              <p>{error}</p>
            </div>
          ) : shop ? (
            <>
              {/* Info Box */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Shop Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Shop Name</div>
                    <div className="font-medium text-gray-900 dark:text-white">{shop.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">BTCPay Server</div>
                    <div className="font-medium text-gray-900 dark:text-white">{shop.server_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Subscription Status</div>
                    <div className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        shop.subscription_status === 'active' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {shop.subscription_status}
                      </span>
                    </div>
                  </div>
                </div>
                {shop.lightning_address && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lightning Address</div>
                    <div className="font-medium text-gray-900 dark:text-white">{shop.lightning_address}</div>
                  </div>
                )}
              </div>

              {/* Subscription History */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription History</h2>
                </div>
                <div className="p-6">
                  {subscriptions.length === 0 ? (
                    <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                      <p>No subscriptions found for this shop.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((subscription) => (
                        <div key={subscription.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {subscription.amount_sats} sats / {subscription.interval}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Created {new Date(subscription.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscription.status === 'active' 
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                  : subscription.status === 'cancelled'
                                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                              }`}>
                                {subscription.status}
                              </span>
                              {subscription.status === 'active' && (
                                <button
                                  onClick={() => handleCancelSubscription(subscription.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                          {/* Payment History for this subscription */}
                          <div className="p-4">
                            <PaymentHistory subscriptionId={subscription.id.toString()} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Actions</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {subscriptions.length > 0 && subscriptions.some((sub) => sub.status === 'active') && (
                      <button className="w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                        Cancel Subscription
                      </button>
                    )}
                    <button 
                      onClick={() => handleRemoveShop(shop.id)}
                      className="w-full px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                    >
                      Remove Shop
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>Shop not found.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 