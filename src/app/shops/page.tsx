"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ShopsDashboard() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Shops Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your shops and subscriptions to BTCPay Server providers</p>
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
                <p>You currently have not listed your shop, please add one here.</p>
                <Link href="/shops/add-shop">
                  <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Add Shop</button>
                </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {shops.map((shop: any) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">{shop.name}</h3>
                        <p className="text-sm text-gray-600">{shop.server_name}</p>
                      <p className="text-xs text-gray-500">Subscription: {shop.subscription_status}</p>
                      </div>
                        <Link
                          href={`/shops/${shop.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details →
                        </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Add Shop Button at the bottom */}
          <div className="flex justify-end mt-6">
            <Link href="/shops/add-shop">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow">
                + Add New Shop
              </button>
            </Link>
          </div>
        </div>
      </div>
  );
} 