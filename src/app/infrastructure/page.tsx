"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InfrastructureDashboard() {
  const [servers, setServers] = useState<Array<{
    id: number;
    name: string;
    host_url: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers');
        if (response.ok) {
          const data = await response.json();
          setServers(data.servers);
        } else {
          setError('Failed to fetch servers');
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
        setError('Failed to fetch servers');
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">BTCPay Server Providers Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your BTCPay Server infrastructure and monitor subscriptions</p>
          </div>
          {/* Info Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{servers.length}</div>
                <div className="text-gray-600">Total Servers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-gray-600">Active Subscriptions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-gray-600">Total Shops</div>
              </div>
            </div>
          </div>
          {/* Servers List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your BTCPay Servers</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading servers...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 py-8">
                  <p>{error}</p>
                </div>
              ) : servers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                <p>You currently have not listed your BTCPay Server, please add one here.</p>
                <Link href="/infrastructure/add-server">
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Add Server</button>
                </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <h3 className="font-medium text-gray-900">{server.name}</h3>
                        <p className="text-sm text-gray-600">{server.host_url}</p>
                        <p className="text-xs text-gray-500">Added {new Date(server.created_at).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/infrastructure/${server.id}`}
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
        </div>
      </div>
  );
} 