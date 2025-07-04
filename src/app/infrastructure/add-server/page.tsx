"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { validateForm, VALIDATION_RULES } from '@/lib/validation';

export default function AddServer() {
  const [name, setName] = useState('');
  const [hostUrl, setHostUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const validation = validateForm(
      { name, hostUrl, apiKey },
      {
        name: VALIDATION_RULES.serverName,
        hostUrl: VALIDATION_RULES.url,
        apiKey: VALIDATION_RULES.required,
      }
    );

    if (!validation.isValid) {
      const fieldErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        const [field, message] = error.split(': ');
        fieldErrors[field] = message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, hostUrl, apiKey }),
      });

      if (response.ok) {
        showToast('Server added successfully!', 'success');
        router.push('/infrastructure');
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to create server', 'error');
      }
    } catch (error) {
      console.error('Error creating server:', error);
      showToast('Failed to create server', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            href="/infrastructure"
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add BTCPay Server</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Server Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="My BTCPay Server"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="hostUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Host URL
              </label>
              <input
                type="url"
                id="hostUrl"
                value={hostUrl}
                onChange={(e) => setHostUrl(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hostUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://your-btcpay-server.com"
                required
              />
              {errors.hostUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.hostUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.apiKey ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your BTCPay API key"
                required
              />
              {errors.apiKey && (
                <p className="mt-1 text-sm text-red-600">{errors.apiKey}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/infrastructure"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Server...' : 'Add Server'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 