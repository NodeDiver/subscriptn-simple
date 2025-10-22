"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShopDashboard({ params }: { params: Promise<{ serverId: string; shopId: string }> }) {
  const [serverId, setServerId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setServerId(resolvedParams.serverId);
    };
    resolveParams();
  }, [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href={`/infrastructure/${serverId}`}
            className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 mr-4 font-medium transition-colors duration-200"
          >
            ← Back to Server
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Shop Dashboard</h1>
        </div>

        {/* Info Box */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 mb-8 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Shop Name</div>
              <div className="font-medium text-neutral-900 dark:text-white">Loading...</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Lightning Address</div>
              <div className="font-medium text-neutral-900 dark:text-white">Loading...</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Subscription Status</div>
              <div className="font-medium">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-8 border border-neutral-200 dark:border-neutral-700">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Subscription History</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-neutral-500 dark:text-neutral-400 py-8">
              <p>No payment history available.</p>
            </div>
          </div>
        </div>

        {/* Rights Management */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">User Rights Management</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">Shop Owner</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Full access to shop management</div>
                </div>
                <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-xl hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200 font-semibold">
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