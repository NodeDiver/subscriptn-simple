"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ServerDashboard({ params }: { params: Promise<{ serverId: string }> }) {
  const { user, logout } = useAuth();
  const [server, setServer] = useState<any>(null);
  const [shops, setShops] = useState([]);
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link 
                href="/infrastructure"
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to Servers
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {server ? server.name : 'Server Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading server data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>{error}</p>
            </div>
          ) : server ? (
            <>
              {/* Info Box */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Server Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Server Name</div>
                    <div className="font-medium">{server.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Host URL</div>
                    <div className="font-medium">{server.host_url}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Number of Shops</div>
                    <div className="font-medium">{shops.length}</div>
                  </div>
                </div>
              </div>

              {/* Shops List */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Shops on this Server</h2>
                </div>
                <div className="p-6">
                  {shops.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No shops found on this server.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shops.map((shop: any) => (
                        <div key={shop.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div>
                            <h3 className="font-medium text-gray-900">{shop.name}</h3>
                            <p className="text-sm text-gray-600">Owner: {shop.owner_username}</p>
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
                              href={`/infrastructure/${serverId}/shops/${shop.id}`}
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
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Server not found.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 