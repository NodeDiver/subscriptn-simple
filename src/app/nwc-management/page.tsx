"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NWCConnectionsList from '@/components/NWCConnectionsList';
import NWCConnectionForm from '@/components/NWCConnectionForm';

export default function NWCManagementPage() {
  const { user } = useAuth();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [showConnectionForm, setShowConnectionForm] = useState(false);

  if (!user) {
    return <div>Please log in to manage NWC connections.</div>;
  }

  const handleConnectionSuccess = () => {
    setShowConnectionForm(false);
    setSelectedSubscriptionId(null);
    // Refresh the connections list
    window.location.reload();
  };

  const handleConnectionCancel = () => {
    setShowConnectionForm(false);
    setSelectedSubscriptionId(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              NWC Management
            </h1>
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
              Manage your Nostr Wallet Connect connections for automatic subscription payments
            </p>
          </div>

          {/* Security Notice */}
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    NWC connection strings contain sensitive wallet credentials. They are encrypted 
                    before storage and only your backend can access them. Never share your NWC 
                    connection strings with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* NWC Connections List */}
            <div className="lg:col-span-2">
              <NWCConnectionsList />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const subscriptionId = prompt('Enter subscription ID:');
                      if (subscriptionId) {
                        setSelectedSubscriptionId(parseInt(subscriptionId));
                        setShowConnectionForm(true);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl magnetic-pull"
                  >
                    Setup NWC Connection
                  </button>

                  <button
                    onClick={() => {
                      fetch('/api/payments/nwc/process', { method: 'GET' })
                        .then(response => response.json())
                        .then(data => {
                          if (data.success) {
                            alert(`Processed ${data.summary.total} payments. ${data.summary.successful} successful, ${data.summary.failed} failed.`);
                          } else {
                            alert('Failed to process payments: ' + data.error);
                          }
                        })
                        .catch(error => {
                          console.error('Error:', error);
                          alert('Failed to process payments');
                        });
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl magnetic-pull"
                  >
                    Process All Payments
                  </button>
                </div>

                {/* Information Panel */}
                <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    How NWC Works
                  </h4>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    <li>• Connect your Nostr wallet via NWC</li>
                    <li>• Automatic payments sent to server owners</li>
                    <li>• Payments processed on subscription intervals</li>
                    <li>• All credentials encrypted and secure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Form Modal */}
          {showConnectionForm && selectedSubscriptionId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <NWCConnectionForm
                  subscriptionId={selectedSubscriptionId}
                  onSuccess={handleConnectionSuccess}
                  onCancel={handleConnectionCancel}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
