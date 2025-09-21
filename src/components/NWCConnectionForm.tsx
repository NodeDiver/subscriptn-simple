"use client";

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface NWCConnectionFormProps {
  subscriptionId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  hasExistingConnection?: boolean;
}

export default function NWCConnectionForm({
  subscriptionId,
  onSuccess,
  onCancel,
  hasExistingConnection = false
}: NWCConnectionFormProps) {
  const [nwcConnectionString, setNwcConnectionString] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nwcConnectionString.trim()) {
      showToast('Please enter a NWC connection string', 'error');
      return;
    }

    // Validate NWC connection string format
    const nwcPattern = /^nostr\+walletconnect:\/\/[a-zA-Z0-9+/=]+$/;
    if (!nwcPattern.test(nwcConnectionString.trim())) {
      showToast('Invalid NWC connection string format', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/nwc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nwcConnectionString: nwcConnectionString.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('NWC connection stored successfully', 'success');
        setNwcConnectionString('');
        onSuccess?.();
      } else {
        showToast(data.error || 'Failed to store NWC connection', 'error');
      }
    } catch (error) {
      console.error('Error storing NWC connection:', error);
      showToast('Failed to store NWC connection', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveConnection = async () => {
    if (!confirm('Are you sure you want to remove the NWC connection? This will stop automatic payments.')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/nwc`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        showToast('NWC connection removed successfully', 'success');
        onSuccess?.();
      } else {
        showToast(data.error || 'Failed to remove NWC connection', 'error');
      }
    } catch (error) {
      console.error('Error removing NWC connection:', error);
      showToast('Failed to remove NWC connection', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {hasExistingConnection ? 'Manage NWC Connection' : 'Setup NWC Connection'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {hasExistingConnection 
            ? 'Your subscription is configured for automatic payments via NWC.'
            : 'Connect your Nostr wallet to enable automatic subscription payments.'
          }
        </p>
      </div>

      {hasExistingConnection ? (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  NWC Connection Active
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Automatic payments are enabled for this subscription.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRemoveConnection}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Removing...' : 'Remove NWC Connection'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nwcConnectionString" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              NWC Connection String
            </label>
            <textarea
              id="nwcConnectionString"
              value={nwcConnectionString}
              onChange={(e) => setNwcConnectionString(e.target.value)}
              placeholder="nostr+walletconnect://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter your NWC connection string to enable automatic payments.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Security Information
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Your NWC connection string is encrypted before storage</li>
                  <li>• Only your backend can access the decrypted connection</li>
                  <li>• Connection strings are stored with AES-256-GCM encryption</li>
                  <li>• You can remove the connection at any time</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting || !nwcConnectionString.trim()}
              className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {isSubmitting ? 'Storing...' : 'Store NWC Connection'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          What is NWC?
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Nostr Wallet Connect (NWC) allows your Nostr wallet to automatically send payments 
          for your subscriptions without manual intervention. Your wallet credentials are 
          securely encrypted and stored.
        </p>
      </div>
    </div>
  );
}
