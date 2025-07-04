"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ShopsDashboard() {
  const { user, logout } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops');
        if (response.ok) {
          const data = await response.json();
          setShops(data.shops);
        } else {
          setError('Failed to fetch shops');
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Failed to fetch shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <ProtectedRoute requiredRole="shop_owner">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Shops Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <Link 
                href="/shops/add-shop"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Shop
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{shops.length}</div>
                <div className="text-gray-600">Total Shops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {shops.filter((shop: any) => shop.subscription_status === 'active').length}
                </div>
                <div className="text-gray-600">Active Subscriptions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {shops.filter((shop: any) => shop.subscription_status === 'inactive').length}
                </div>
                <div className="text-gray-600">Lapsed Subscriptions</div>
              </div>
            </div>
          </div>

          {/* Shops List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">My Shops</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading shops...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">
                  <p>{error}</p>
                </div>
              ) : shops.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No shops added yet.</p>
                  <p className="text-sm mt-2">Click "Add Shop" to create your first subscription.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shops.map((shop: any) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">{shop.name}</h3>
                        <p className="text-sm text-gray-600">{shop.server_name}</p>
                        {shop.lightning_address && (
                          <p className="text-sm text-gray-500">{shop.lightning_address}</p>
                        )}
                        <p className="text-xs text-gray-500">Added {new Date(shop.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          shop.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {shop.subscription_status}
                        </span>
                        <Link
                          href={`/shops/${shop.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 