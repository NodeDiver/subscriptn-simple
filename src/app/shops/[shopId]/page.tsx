"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ShopView({ params }: { params: { shopId: string } }) {
  const { user, logout } = useAuth();
  const [shop, setShop] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState([]);
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
    const warningMessage = `Are you sure you want to remove this shop?\n\n⚠️ WARNING: This will also:\n• Cancel all active subscriptions\n• Stop recurring payments to the BTCPay Server owner\n• Permanently delete all subscription history\n\nThis action cannot be undone.`;
    
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
        // Fetch shop details
        const shopResponse = await fetch(`/api/shops/${params.shopId}`);
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          setShop(shopData.shop);
        }

        // Fetch subscriptions for this shop
        const subscriptionsResponse = await fetch(`/api/shops/${params.shopId}/subscriptions`);
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
  }, [params.shopId]);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link 
                href="/shops"
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to My Shops
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {shop ? shop.name : 'Shop Details'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading shop data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>{error}</p>
            </div>
          ) : shop ? (
            <>
              {/* Info Box */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Shop Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Shop Name</div>
                    <div className="font-medium text-gray-900">{shop.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">BTCPay Server</div>
                    <div className="font-medium text-gray-900">{shop.server_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Subscription Status</div>
                    <div className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        shop.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {shop.subscription_status}
                      </span>
                    </div>
                  </div>
                </div>
                {shop.lightning_address && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">Lightning Address</div>
                    <div className="font-medium text-gray-900">{shop.lightning_address}</div>
                  </div>
                )}
              </div>

              {/* Subscription History */}
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Subscription History</h2>
                </div>
                <div className="p-6">
                  {subscriptions.length === 0 ? (
                    <div className="text-center text-gray-600 py-8">
                      <p>No subscriptions found for this shop.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map((subscription: any) => (
                        <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {subscription.amount_sats} sats / {subscription.interval}
                            </h3>
                            <p className="text-sm text-gray-600">Created {new Date(subscription.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscription.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : subscription.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subscription.status}
                            </span>
                            {subscription.status === 'active' && (
                              <button
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {subscriptions.length > 0 && subscriptions.some((sub: any) => sub.status === 'active') && (
                      <button className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors">
                        Cancel Subscription
                      </button>
                    )}
                    <button 
                      onClick={() => handleRemoveShop(shop.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove Shop
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Shop not found.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 