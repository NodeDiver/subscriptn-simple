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

export default function HomePage() {
  const { user, loading } = useAuth();
  const [publicServers, setPublicServers] = useState<BTCPayServer[]>([]);
  const [myServers, setMyServers] = useState<BTCPayServer[]>([]);
  const [serversLoading, setServersLoading] = useState(true);
  const [serversError, setServersError] = useState('');

  useEffect(() => {
    const fetchServers = async () => {
      try {
        // Fetch public servers
        const publicResponse = await fetch('/api/servers/public');
        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          setPublicServers(publicData.servers);
        }

        // Fetch user's servers if authenticated
        if (user) {
          const myResponse = await fetch('/api/servers');
          if (myResponse.ok) {
            const myData = await myResponse.json();
            const myOwnServers = myData.servers.filter((server: any) => server.is_owner);
            setMyServers(myOwnServers);
          }
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
        setServersError('Failed to fetch servers');
      } finally {
        setServersLoading(false);
      }
    };

    fetchServers();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 bg-clip-text text-transparent">
              SubscriptN
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners. Streamline recurring payments and server management in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 text-white px-8 py-4 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-500 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 text-white px-8 py-4 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-500 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/shops"
                  className="bg-green-600 dark:bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Browse Shops
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Choose Your Path
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Whether you're providing BTCPay Server infrastructure or running a shop, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* BTCPay Server Providers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">BTCPay Server Providers</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  List your BTCPay Server infrastructure and manage subscriptions from shop owners. Earn recurring revenue while providing reliable Bitcoin payment processing services.
                </p>
              </div>
              <Link
                href="#servers-list"
                className="block w-full bg-blue-600 dark:bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
              >
                Browse Servers
              </Link>
            </div>

            {/* Shop Owners */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Shop Owners</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Subscribe to BTCPay Server infrastructure and manage your Bitcoin payment processing. Find reliable providers and streamline your payment operations.
                </p>
              </div>
              <Link
                href="/shops"
                className="block w-full bg-green-600 dark:bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
              >
                Browse Shops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Dashboard Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              BTCPay Server Infrastructure
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover available BTCPay Server infrastructure providers and manage your own servers. 
              Connect with reliable Bitcoin payment processing services.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">Network Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{totalPublicServers}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Public Servers</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Available for connection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{totalAvailableSlots}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Available Slots</div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Ready for new shops</div>
              </div>
              {user && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{totalMyServers}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">Your Servers</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Under your management</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/infrastructure/add-server"
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add BTCPay Server
            </Link>
            {publicServers.length > 0 && (
              <Link
                href="#servers-list"
                className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Servers
              </Link>
            )}
          </div>

          {/* Servers List */}
          <div id="servers-list" className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Available BTCPay Servers</h3>
                {publicServers.length > 0 && (
                  <Link href="/infrastructure/add-server">
                    <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium">
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
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No servers available yet</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Be the first to list your BTCPay Server infrastructure!</p>
                  <Link href="/infrastructure/add-server">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                      List Your Server
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {publicServers.slice(0, 6).map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{server.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{server.host_url}</p>
                            {server.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{server.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span>Listed {new Date(server.created_at).toLocaleDateString()}</span>
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
                          View Details →
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
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/screenshots/logo_square.webp"
                    alt="SubscriptN Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">SubscriptN</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Streamlining Bitcoin subscription management for BTCPay Server infrastructure and shop owners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">For Providers</h4>
              <ul className="space-y-1">
                <li><Link href="#servers-list" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-green-500 dark:hover:text-green-400">Browse Servers</Link></li>
                <li><Link href="/infrastructure/add-server" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-green-500 dark:hover:text-green-400">Add Server</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">For Shops</h4>
              <ul className="space-y-1">
                <li><Link href="/shops" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-blue-500 dark:hover:text-blue-400">Shops Dashboard</Link></li>
                <li><Link href="/shops/add-shop" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-blue-500 dark:hover:text-blue-400">Add Shop</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © 2024 SubscriptN. Built for the Bitcoin ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
