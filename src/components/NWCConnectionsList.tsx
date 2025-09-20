"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface NWCConnection {
  subscriptionId: number;
  shopName: string;
  hasConnection: boolean;
  createdAt: string;
}

export default function NWCConnectionsList() {
  const [connections, setConnections] = useState<NWCConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchNWCConnections();
  }, []);

  const fetchNWCConnections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/nwc-connections');
      const data = await response.json();

      if (response.ok) {
        setConnections(data.connections || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch NWC connections');
      }
    } catch (error) {
      console.error('Error fetching NWC connections:', error);
      setError('Failed to fetch NWC connections');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (subscriptionId: number) => {
    try {
      const response = await fetch('/api/payments/nwc/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          force: true
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Payment processed successfully', 'success');
      } else {
        showToast(data.error || 'Failed to process payment', 'error');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Failed to process payment', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading NWC Connections
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchNWCConnections}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Subscriptions Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have any subscriptions yet. Create a subscription to manage NWC connections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          NWC Connections ({connections.length})
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Manage your Nostr Wallet Connect connections for automatic payments
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {connections.map((connection) => (
          <div key={connection.subscriptionId} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    connection.hasConnection 
                      ? 'bg-green-400' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {connection.shopName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Subscription ID: {connection.subscriptionId}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Created: {new Date(connection.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {connection.hasConnection ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Connected
                    </span>
                    <button
                      onClick={() => handleProcessPayment(connection.subscriptionId)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Test Payment
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p className="mb-2">
            <strong>Connected:</strong> Subscription has NWC connection configured for automatic payments
          </p>
          <p>
            <strong>Not Connected:</strong> Subscription requires NWC connection setup for automatic payments
          </p>
        </div>
      </div>
    </div>
  );
}
