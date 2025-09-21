"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface BTCPayServer {
  id: number;
  name: string;
  host_url: string;
  description: string;
  lightning_address: string;
  available_slots: number;
  current_shops: number;
  is_online: boolean;
  last_seen_online?: string;
  is_owner: number;
  owner_id: number;
  created_at: string;
  is_public: boolean;
}

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

export default function HomePage() {
  const { user, loading } = useAuth();
  const [publicServers, setPublicServers] = useState<BTCPayServer[]>([]);
  const [myServers, setMyServers] = useState<BTCPayServer[]>([]);
  const [serversLoading, setServersLoading] = useState(true);
  const [serversError, setServersError] = useState('');
  const [publicShops, setPublicShops] = useState<PublicShop[]>([]);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch public servers
        const publicServersResponse = await fetch('/api/servers/public');
        if (publicServersResponse.ok) {
          const publicServersData = await publicServersResponse.json();
          setPublicServers(publicServersData.servers);
        }

        // Fetch public shops
        const publicShopsResponse = await fetch('/api/shops/public');
        if (publicShopsResponse.ok) {
          const publicShopsData = await publicShopsResponse.json();
          setPublicShops(publicShopsData.shops);
        }

        // Fetch user's servers if authenticated
        if (user) {
          const myServersResponse = await fetch('/api/servers');
          if (myServersResponse.ok) {
            const myServersData = await myServersResponse.json();
            const myOwnServers = myServersData.servers.filter((server: any) => server.is_owner);
            setMyServers(myOwnServers);
          }

          // Fetch user's shops if authenticated
          const myShopsResponse = await fetch('/api/shops');
          if (myShopsResponse.ok) {
            const myShopsData = await myShopsResponse.json();
            setMyShops(myShopsData.shops);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setServersError('Failed to fetch servers');
        setShopsError('Failed to fetch shops');
      } finally {
        setServersLoading(false);
        setShopsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalAvailableSlots = publicServers.reduce((sum, server) => sum + server.available_slots, 0);
  const totalPublicServers = publicServers.length;
  const totalMyServers = myServers.length;
  const totalPublicShops = publicShops.length;
  const totalMyShops = myShops.length;
  const totalActiveSubscriptions = myShops.filter((shop) => shop.subscription_status === 'active').length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-8 leading-tight">
            Bitcoin Infrastructure
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              Made Simple
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect BTCPay Server providers with shop owners through automated Bitcoin subscriptions. 
            Streamline payments and grow your Bitcoin business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 text-base font-medium shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 text-base font-medium shadow-lg hover:shadow-xl"
                >
                  Start Building
                </Link>
                <Link
                  href="#marketplace"
                  className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-8 py-3 rounded-lg transition-colors duration-200 text-base font-medium"
                >
                  Explore Marketplace
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Simple, secure Bitcoin infrastructure for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Providers */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">For Providers</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                List your BTCPay Server infrastructure and earn recurring revenue from shop subscriptions.
              </p>
              <Link
                href="#servers-list"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Explore servers
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Shop Owners */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">For Shop Owners</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                Find reliable BTCPay Server providers and streamline your Bitcoin payment processing.
              </p>
              <Link
                href="#shops-list"
                className="inline-flex items-center text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium"
              >
                Browse shops
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Dashboard Section */}
      <section id="marketplace" className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              BTCPay Server Infrastructure
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Connect with reliable Bitcoin payment processing providers
            </p>
          </div>

          {/* Stats Overview */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-8 mb-12 border border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{totalPublicServers}</div>
                <div className="text-neutral-600 dark:text-neutral-300 font-medium">Available Servers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-support-600 dark:text-support-400 mb-2">{totalAvailableSlots}</div>
                <div className="text-neutral-600 dark:text-neutral-300 font-medium">Open Slots</div>
              </div>
              {user && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">{totalMyServers}</div>
                  <div className="text-neutral-600 dark:text-neutral-300 font-medium">Your Servers</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/infrastructure/add-server"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your Server
            </Link>
            {publicServers.length > 0 && (
              <Link
                href="#servers-list"
                className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Servers
              </Link>
            )}
          </div>

          {/* Servers List */}
          <div id="servers-list" className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Available Servers</h3>
                {publicServers.length > 0 && (
                  <Link href="/infrastructure/add-server">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      List Your Server
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6">
              {serversLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading servers...</p>
                </div>
              ) : serversError ? (
                <div className="text-center text-red-600 dark:text-red-400 py-8">
                  <p>{serversError}</p>
                </div>
              ) : publicServers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">No servers available</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">Be the first to list your infrastructure</p>
                  <Link href="/infrastructure/add-server">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                      List Your Server
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {publicServers.slice(0, 6).map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-white mb-1">{server.name}</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{server.host_url}</p>
                        {server.description && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-500">{server.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-support-600 dark:text-support-400">
                            {server.available_slots} slots
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-500">
                            {server.current_shops} connected
                          </div>
                        </div>
                        <Link
                          href={`/infrastructure/${server.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                  {publicServers.length > 6 && (
                    <div className="text-center pt-4">
                      <Link
                        href="/infrastructure"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        View all {publicServers.length} servers →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* My Servers Section - Only show if user has servers */}
          {user && myServers.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your BTCPay Servers</h3>
                  <Link href="/infrastructure/add-server">
                    <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium">
                      Add Server
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {myServers.map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{server.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                server.is_public 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {server.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{server.host_url}</p>
                            {server.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{server.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span>Added {new Date(server.created_at).toLocaleDateString()}</span>
                              {server.lightning_address && (
                                <span>Lightning: {server.lightning_address}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {server.available_slots}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              slots available
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                              {server.current_shops} connected
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/infrastructure/${server.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          Manage →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shops Dashboard Section */}
      <section id="shops-list" className="py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Shop Marketplace
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Discover shops using Bitcoin subscriptions and grow your business
            </p>
          </div>

          {/* Shop Stats Overview */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl shadow-sm p-8 mb-12 border border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">{totalPublicShops}</div>
                <div className="text-neutral-600 dark:text-neutral-300 font-medium">Available Shops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-support-600 dark:text-support-400 mb-2">{totalActiveSubscriptions}</div>
                <div className="text-neutral-600 dark:text-neutral-300 font-medium">Active Subscriptions</div>
              </div>
              {user && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{totalMyShops}</div>
                  <div className="text-neutral-600 dark:text-neutral-300 font-medium">Your Shops</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/shops/add-shop"
              className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add Your Shop
            </Link>
            {publicShops.length > 0 && (
              <Link
                href="#shops-list"
                className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Shops
              </Link>
            )}
          </div>

          {/* Shops List */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Available Shops</h3>
                {publicShops.length > 0 && (
                  <Link href="/shops/add-shop">
                    <button className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      List Your Shop
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6">
              {shopsLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading shops...</p>
                </div>
              ) : shopsError ? (
                <div className="text-center text-red-600 dark:text-red-400 py-8">
                  <p>{shopsError}</p>
                </div>
              ) : publicShops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No shops available yet</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to list your shop in the marketplace!</p>
                  <Link href="/shops/add-shop">
                    <button className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                      List Your Shop
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {publicShops.slice(0, 6).map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{shop.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                shop.is_public 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {shop.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connected to: {shop.server_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">Owner: {shop.owner_username}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span>Added {new Date(shop.created_at).toLocaleDateString()}</span>
                              {shop.lightning_address && (
                                <span>Lightning: {shop.lightning_address}</span>
                              )}
                            </div>
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
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/shops/${shop.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                  {publicShops.length > 6 && (
                    <div className="text-center pt-4">
                      <Link
                        href="/shops"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        View all {publicShops.length} shops →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* My Shops Section - Only show if user has shops */}
          {user && myShops.length > 0 && (
            <div className="mt-8 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Shops</h3>
                  <Link href="/shops/add-shop">
                    <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium">
                      Add Shop
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {myShops.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{shop.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                shop.is_public 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {shop.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connected to: {shop.server_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">Lightning: {shop.lightning_address}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span>Added {new Date(shop.created_at).toLocaleDateString()}</span>
                            </div>
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
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/shops/${shop.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                        >
                          Manage →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Shop Section - Only show if user has no shops and is authenticated */}
          {user && myShops.length === 0 && !shopsLoading && (
            <div className="mt-8 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start Your Shop Journey</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Don't have any shops yet? Add your first shop to start connecting to BTCPay servers and managing subscriptions.
                </p>
                <Link href="/shops/add-shop">
                  <button className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    Add Your First Shop
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/screenshots/logo_square.webp"
                  alt="SubscriptN Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">SubscriptN</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
              Bitcoin infrastructure made simple. Connect providers with shop owners through automated subscriptions.
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="#servers-list" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                Browse Servers
              </Link>
              <Link href="#shops-list" className="text-neutral-600 dark:text-neutral-300 hover:text-accent-600 dark:hover:text-accent-400 font-medium">
                Browse Shops
              </Link>
              <Link href="/infrastructure/add-server" className="text-neutral-600 dark:text-neutral-300 hover:text-support-600 dark:hover:text-support-400 font-medium">
                Add Server
              </Link>
              <Link href="/shops/add-shop" className="text-neutral-600 dark:text-neutral-300 hover:text-support-600 dark:hover:text-support-400 font-medium">
                Add Shop
              </Link>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <p className="text-neutral-500 dark:text-neutral-400">
                © 2024 SubscriptN. Built for the Bitcoin ecosystem.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
