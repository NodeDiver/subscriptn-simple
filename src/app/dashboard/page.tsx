"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shop {
  id: number;
  name: string;
  server_name: string;
  subscription_status: string;
}

interface Server {
  id: number;
  name: string;
  host_url: string;
  created_at: string;
  is_online?: boolean;
  last_seen_online?: string;
}

export default function Dashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shops
        const shopsResponse = await fetch('/api/shops');
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          setShops(shopsData.shops);
        }

        // Fetch servers
        const serversResponse = await fetch('/api/servers');
        if (serversResponse.ok) {
          const serversData = await serversResponse.json();
          // Add mock health data for demonstration
          const serversWithHealth = serversData.servers.map((server: Server) => ({
            ...server,
            is_online: server.name === 'muni btcpayserver' ? true : Math.random() > 0.3, // muni server is online, others random
            last_seen_online: server.name === 'muni btcpayserver' ? new Date().toISOString() : 
              new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() // random time within last 24h
          }));
          setServers(serversWithHealth);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate additional stats
  const activeSubscriptions = shops.filter(shop => shop.subscription_status === 'active').length;
  const pendingSubscriptions = shops.filter(shop => shop.subscription_status === 'pending').length;
  const cancelledSubscriptions = shops.filter(shop => shop.subscription_status === 'cancelled').length;
  
  // Revenue calculation (placeholder - $10 per active subscription)
  const monthlyRevenue = activeSubscriptions * 10;
  const yearlyRevenue = monthlyRevenue * 12;
  const currentRevenue = revenuePeriod === 'monthly' ? monthlyRevenue : yearlyRevenue;
  
  // Convert to satoshis (1 USD ≈ 3,000,000 sats as placeholder)
  const satoshiRate = 3000000;
  const revenueInSats = Math.round(currentRevenue * satoshiRate);

  // Conditional display logic
  const hasServers = servers.length > 0;
  const hasActiveSubscriptions = activeSubscriptions > 0;

  // Helper function to format last seen time
  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome to your SubscriptN dashboard</p>
        </div>
        
        {/* Enhanced Overview Section */}
        <div className="mb-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Shops Subscribed - Only show if user has servers */}
            {hasServers && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-[#2D5A3D]/10 dark:bg-[#10B981]/20 rounded-lg">
                    <svg className="w-6 h-6 text-[#2D5A3D] dark:text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shops Subscribed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeSubscriptions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* BTCPay Servers - Only show if user has servers */}
            {hasServers && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 bg-[#1E3A8A]/10 dark:bg-[#3B82F6]/20 rounded-lg">
                    <svg className="w-6 h-6 text-[#1E3A8A] dark:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">BTCPay Servers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{servers.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly/Yearly Revenue - Only show if user has servers */}
            {hasServers && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#0F766E]/10 dark:bg-[#14B8A6]/20 rounded-lg">
                      <svg className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentRevenue}</p>
                    </div>
                  </div>
                  
                  {/* Period Toggle */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setRevenuePeriod('monthly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        revenuePeriod === 'monthly'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setRevenuePeriod('yearly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        revenuePeriod === 'yearly'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                
                {/* Satoshi Conversion */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {revenueInSats.toLocaleString()} sats
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Two Boxes Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Box - BTCPay Servers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">BTCPay Servers</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading servers...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 dark:text-red-400 py-8">
                  <p>{error}</p>
                </div>
              ) : servers.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>You currently have not listed your BTCPay Server, please add one here.</p>
                  <Link href="/infrastructure/add-server">
                    <button className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Add Server</button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${server.is_online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-xs font-medium ${server.is_online ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {server.is_online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{server.host_url}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Added {new Date(server.created_at).toLocaleDateString()}</p>
                        {!server.is_online && server.last_seen_online && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                            Last seen online: {formatLastSeen(server.last_seen_online)}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/infrastructure/${server.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-4"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Box - My Shops */}
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
    </div>
  );
} 