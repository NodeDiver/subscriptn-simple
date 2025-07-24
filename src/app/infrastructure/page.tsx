"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PublicServer {
  id: number;
  name: string;
  host_url: string;
  description?: string;
  slots_available: number;
  lightning_address: string;
  created_at: string;
  provider_id: number;
  current_shops: number;
  available_slots: number;
}

interface MyServer {
  id: number;
  name: string;
  host_url: string;
  description?: string;
  slots_available: number;
  lightning_address: string;
  created_at: string;
  is_public: boolean;
  current_shops: number;
  available_slots: number;
}

export default function InfrastructureDashboard() {
  const [publicServers, setPublicServers] = useState<PublicServer[]>([]);
  const [myServers, setMyServers] = useState<MyServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch public servers
        const publicResponse = await fetch('/api/servers/public');
        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          setPublicServers(publicData.servers);
        }

        // Fetch user's servers
        const myResponse = await fetch('/api/servers');
        if (myResponse.ok) {
          const myData = await myResponse.json();
          const myOwnServers = myData.servers.filter((server: any) => server.is_owner);
          setMyServers(myOwnServers);
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
        setError('Failed to fetch servers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAvailableSlots = publicServers.reduce((sum, server) => sum + server.available_slots, 0);
  const totalPublicServers = publicServers.length;
  const totalMyServers = myServers.length;
  const totalConnectedShops = myServers.reduce((sum, server) => sum + server.current_shops, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Infrastructure Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Browse public BTCPay servers and manage your own infrastructure</p>
        </div>
        
        {/* Info Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPublicServers}</div>
              <div className="text-gray-600 dark:text-gray-400">Public Servers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalAvailableSlots}</div>
              <div className="text-gray-600 dark:text-gray-400">Available Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalMyServers}</div>
              <div className="text-gray-600 dark:text-gray-400">Your Servers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalConnectedShops}</div>
              <div className="text-gray-600 dark:text-gray-400">Connected Shops</div>
            </div>
          </div>
        </div>

        {/* Public Servers Section - Browse Servers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Browse BTCPay Servers</h2>
              <Link href="/infrastructure/add-server">
                <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  List Your Server
                </button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading public servers...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 dark:text-red-400 py-8">
                <p>{error}</p>
              </div>
            ) : publicServers.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No public BTCPay servers are currently available.</p>
                <p className="mt-2">Be the first to list your server!</p>
                <Link href="/infrastructure/add-server">
                  <button className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    List Your Server
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {publicServers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{server.host_url}</p>
                          {server.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{server.description}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Listed {new Date(server.created_at).toLocaleDateString()}
                          </p>
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

        {/* My Servers Section - Only show if user has servers */}
        {myServers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your BTCPay Servers</h2>
                <Link href="/infrastructure/add-server">
                  <button className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                    Add Server
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {myServers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">{server.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              server.is_public 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {server.is_public ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{server.host_url}</p>
                          {server.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{server.description}</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Added {new Date(server.created_at).toLocaleDateString()}
                          </p>
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

        {/* Add Server Section - Only show if user has no servers */}
        {myServers.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start Your Infrastructure</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Don't have any BTCPay servers yet? Add your first server to start providing infrastructure to shop owners.
              </p>
              <Link href="/infrastructure/add-server">
                <button className="bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                  Add Your First Server
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 