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
  provider_id: number;
  is_owner: number; // 1 if user owns, 0 if not
  is_online?: boolean;
  last_seen_online?: string;
}

// Revenue Component for inline display - only shown to owners
function RevenueDisplay({ serverId }: { serverId: number }) {
  const [revenuePeriod, setRevenuePeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Calculate revenue for this specific server (placeholder - $10 per active subscription)
  const monthlyRevenue = 10; // Placeholder - would be calculated based on server's shops
  const yearlyRevenue = monthlyRevenue * 12;
  const currentRevenue = revenuePeriod === 'monthly' ? monthlyRevenue : yearlyRevenue;
  
  // Convert to satoshis (1 USD ≈ 3,000,000 sats as placeholder)
  const satoshiRate = 3000000;
  const revenueInSats = Math.round(currentRevenue * satoshiRate);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 ml-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1 bg-[#0F766E]/10 dark:bg-[#14B8A6]/20 rounded">
            <svg className="w-4 h-4 text-[#0F766E] dark:text-[#14B8A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Revenue</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">${currentRevenue}</p>
          </div>
        </div>
        
        {/* Period Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded p-1">
          <button
            onClick={() => setRevenuePeriod('monthly')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              revenuePeriod === 'monthly'
                ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            M
          </button>
          <button
            onClick={() => setRevenuePeriod('yearly')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              revenuePeriod === 'yearly'
                ? 'bg-white dark:bg-gray-500 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Y
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
  );
}

// Contact Admin Component for non-owners
function ContactAdminDisplay({ serverName }: { serverName: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 ml-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1 bg-[#F59E0B]/10 dark:bg-[#FBBF24]/20 rounded">
            <svg className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Contact Admin</p>
            <p className="text-xs text-gray-900 dark:text-white font-medium">{serverName}</p>
          </div>
        </div>
      </div>
      
      {/* Contact Button */}
      <div className="text-center">
        <button className="text-xs bg-[#F59E0B] dark:bg-[#FBBF24] text-white px-3 py-1 rounded hover:bg-[#D97706] dark:hover:bg-[#F59E0B] transition-colors">
          Message Admin
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Conditional display logic
  const ownedServers = servers.filter(server => server.is_owner === 1);
  const hasOwnedServers = ownedServers.length > 0;
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{servers.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Servers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
              <div className="text-gray-600 dark:text-gray-400">Shops Subscribed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
              <div className="text-gray-600 dark:text-gray-400">other info</div>
            </div>
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
                      <Link href={`/infrastructure/${server.id}`} className="flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded p-2 -m-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white hover:text-[#1E3A8A] dark:hover:text-[#3B82F6] transition-colors">{server.name}</h3>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${server.is_online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-xs font-medium ${server.is_online ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {server.is_online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#1E3A8A] dark:hover:text-[#3B82F6] transition-colors">{server.host_url}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 hover:text-[#1E3A8A] dark:hover:text-[#3B82F6] transition-colors">Added {new Date(server.created_at).toLocaleDateString()}</p>
                        {!server.is_online && server.last_seen_online && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                            Last seen online: {formatLastSeen(server.last_seen_online)}
                          </p>
                        )}
                      </Link>
                      
                      {/* Revenue Display inline with server - only for owners */}
                      {server.is_owner === 1 && <RevenueDisplay serverId={server.id} />}
                      
                      {/* Contact Admin Display for non-owners */}
                      {server.is_owner === 0 && <ContactAdminDisplay serverName={server.name} />}
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