"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ServerDashboard({ params }: { params: Promise<{ serverId: string }> }) {
  const { user, logout } = useAuth();
  const [server, setServer] = useState<{
    id: number;
    name: string;
    host_url: string;
  } | null>(null);
  const [shops, setShops] = useState<Array<{
    id: number;
    name: string;
    owner_username: string;
    lightning_address?: string;
    created_at: string;
    subscription_status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverId, setServerId] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const { serverId: resolvedServerId } = await params;
        setServerId(resolvedServerId);
        
        // Fetch server details
        const serverResponse = await fetch(`/api/servers/${resolvedServerId}`);
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          setServer(serverData.server);
        }

        // Fetch shops for this server
        const shopsResponse = await fetch(`/api/servers/${resolvedServerId}/shops`);
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json();
          setShops(shopsData.shops);
        }
      } catch (error) {
        console.error('Error fetching server data:', error);
        setError('Failed to fetch server data');
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [params]);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link 
                href="/infrastructure"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
              >
                ← Back to Servers
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {server ? server.name : 'Server Dashboard'}
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading server data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 dark:text-red-400 py-8">
              <p>{error}</p>
            </div>
          ) : server ? (
            <>
              {/* Info Box */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Server Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Server Name</div>
                    <div className="font-medium text-gray-900 dark:text-white">{server.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Host URL</div>
                    <div className="font-medium text-gray-900 dark:text-white">{server.host_url}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Number of Shops</div>
                    <div className="font-medium text-gray-900 dark:text-white">{shops.length}</div>
                  </div>
                </div>
              </div>

              {/* Shops List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shops on this Server</h2>
                </div>
                <div className="p-6">
                  {shops.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <p>No shops found on this server.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shops.map((shop) => (
                        <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{shop.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {shop.owner_username}</p>
                            {shop.lightning_address && (
                              <p className="text-sm text-gray-500 dark:text-gray-500">{shop.lightning_address}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-500">Added {new Date(shop.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              shop.subscription_status === 'active' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {shop.subscription_status}
                            </span>
                            <Link
                              href={`/infrastructure/${serverId}/shops/${shop.id}`}
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
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>Server not found.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 