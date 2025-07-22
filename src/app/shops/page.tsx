"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shop {
  id: number;
  name: string;
  server_name: string;
  subscription_status: string;
}

export default function ShopsDashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Shops Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your shops and subscriptions to BTCPay Server providers</p>
        </div>
        
        {/* Info Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{shops.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Shops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {shops.filter((shop) => shop.subscription_status === 'active').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Subscriptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {shops.filter((shop) => shop.subscription_status === 'inactive').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Lapsed Subscriptions</div>
            </div>
          </div>
        </div>
        
        {/* Shops List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Shops</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading shops...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 dark:text-red-400 py-8">
                <p>{error}</p>
              </div>
            ) : shops.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>You currently have not listed your shop, please add one here.</p>
                <Link href="/shops/add-shop">
                  <button className="mt-4 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">Add Shop</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {shops.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{shop.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shop.server_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Subscription: {shop.subscription_status}</p>
                    </div>
                    <Link
                      href={`/shops/${shop.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 