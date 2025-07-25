"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shop {
  id: number;
  name: string;
  server_name: string;
  subscription_status: string;
  lightning_address: string;
  is_public: boolean;
  created_at: string;
  owner_username?: string;
}

interface PublicShop {
  id: number;
  name: string;
  server_name: string;
  subscription_status: string;
  lightning_address: string;
  is_public: boolean;
  created_at: string;
  owner_username: string;
}

export default function ShopsDashboard() {
  const [publicShops, setPublicShops] = useState<PublicShop[]>([]);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch public shops
        const publicResponse = await fetch('/api/shops/public');
        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          setPublicShops(publicData.shops);
        }

        // Fetch user's shops
        const myResponse = await fetch('/api/shops');
        if (myResponse.ok) {
          const myData = await myResponse.json();
          setMyShops(myData.shops);
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Failed to fetch shops');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPublicShops = publicShops.length;
  const totalMyShops = myShops.length;
  const totalActiveSubscriptions = myShops.filter((shop) => shop.subscription_status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shops Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Browse public shops and manage your own shop subscriptions</p>
        </div>
        
        {/* Info Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPublicShops}</div>
              <div className="text-gray-600 dark:text-gray-400">Public Shops</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalActiveSubscriptions}</div>
              <div className="text-gray-600 dark:text-gray-400">Active Subscriptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalMyShops}</div>
              <div className="text-gray-600 dark:text-gray-400">Your Shops</div>
            </div>
          </div>
        </div>
        
        {/* Public Shops Section - Shop listing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shop listing</h2>
              <Link href="/shops/add-shop">
                <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Add Your Shop
                </button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading public shops...</div>
            ) : error ? (
              <div className="text-center text-red-500 dark:text-red-400">
                <p>{error}</p>
              </div>
            ) : publicShops.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No public shops are currently available.</p>
                <p className="mt-2">Be the first to <Link href="/shops/add-shop" className="text-blue-600 dark:text-blue-400 hover:underline">add your shop</Link>!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publicShops.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{shop.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          shop.is_public 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {shop.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connected to: {shop.server_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Owner: {shop.owner_username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Added {new Date(shop.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shop.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : shop.subscription_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {shop.subscription_status.charAt(0).toUpperCase() + shop.subscription_status.slice(1)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/shops/${shop.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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

        {/* My Shops Section - Only show if user has shops */}
        {myShops.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Shops</h2>
                <Link href="/shops/add-shop">
                  <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                    Add Shop
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {myShops.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{shop.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          shop.is_public 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {shop.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connected to: {shop.server_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Lightning: {shop.lightning_address}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Added {new Date(shop.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shop.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : shop.subscription_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {shop.subscription_status.charAt(0).toUpperCase() + shop.subscription_status.slice(1)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/shops/${shop.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Shop Section - Only show if user has no shops */}
        {myShops.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start Your Shop Journey</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Don't have any shops yet? Add your first shop to start connecting to BTCPay servers and managing subscriptions.
              </p>
              <Link href="/shops/add-shop">
                <button className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                  Add Your First Shop
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 