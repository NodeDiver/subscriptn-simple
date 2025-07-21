"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShopDashboard({ params }: { params: Promise<{ serverId: string; shopId: string }> }) {
  const [serverId, setServerId] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setServerId(resolvedParams.serverId);
      setShopId(resolvedParams.shopId);
    };
    resolveParams();
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            href={`/infrastructure/${serverId}`}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to Server
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Shop Name</div>
              <div className="font-medium">Loading...</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Lightning Address</div>
              <div className="font-medium">Loading...</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Subscription Status</div>
              <div className="font-medium">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Subscription History</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <p>No payment history available.</p>
            </div>
          </div>
        </div>

        {/* Rights Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">User Rights Management</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Shop Owner</div>
                  <div className="text-sm text-gray-600">Full access to shop management</div>
                </div>
                <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors">
                  Demote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 