"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (!loading && user) {
      router.push('/infrastructure');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Debug Theme Indicator */}
      {mounted && (
        <div className="fixed top-20 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 z-40">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Theme: <span className="font-bold">{theme}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            HTML: {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-subscriptn-dark-green dark:via-subscriptn-dark-teal dark:to-subscriptn-dark-blue bg-clip-text text-transparent">
              SubscriptN
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners. Streamline recurring payments and server management in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="w-full sm:w-auto bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-subscriptn-dark-green dark:to-subscriptn-dark-blue text-white py-3 px-8 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-subscriptn-dark-teal dark:hover:to-subscriptn-dark-teal transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* BTCPay Server Providers Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-subscriptn-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-subscriptn-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">BTCPay Server Providers</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Manage your BTCPay Server infrastructure, monitor shops, and handle subscriptions. Perfect for infrastructure owners and server administrators.
            </p>
            <a
              href="/login"
              className="w-full bg-subscriptn-blue-500 dark:bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-subscriptn-teal-500 dark:hover:bg-blue-600 transition-colors font-medium text-center block"
            >
              Access Provider Dashboard
            </a>
          </div>

          {/* Shop Owners Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-subscriptn-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-subscriptn-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Shop Owners</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Manage your shops, create new subscriptions to BTCPay Server providers, and track your payment history. Ideal for merchants and shop operators.
            </p>
            <a
              href="/login"
              className="w-full bg-subscriptn-green-500 dark:bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-subscriptn-teal-500 dark:hover:bg-green-600 transition-colors font-medium text-center block"
            >
              Access Shop Dashboard
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            Powered by{' '}
            <a href="https://btcpayserver.org" target="_blank" rel="noopener noreferrer" className="text-subscriptn-green-500 dark:text-green-400 hover:text-subscriptn-teal-500 dark:hover:text-green-300 underline">
              BTCPay Server
            </a>
            ,{' '}
            <a href="https://lightning.network" target="_blank" rel="noopener noreferrer" className="text-subscriptn-blue-500 dark:text-blue-400 hover:text-subscriptn-teal-500 dark:hover:text-blue-300 underline">
              lightning network
            </a>
            ,{' '}
            <a href="https://nwc.dev" target="_blank" rel="noopener noreferrer" className="text-subscriptn-teal-500 dark:text-teal-400 hover:text-subscriptn-green-500 dark:hover:text-teal-300 underline">
              NWC
            </a>
            , and{' '}
            <a href="https://bitcoin-connect.com" target="_blank" rel="noopener noreferrer" className="text-subscriptn-blue-500 dark:text-blue-400 hover:text-subscriptn-teal-500 dark:hover:text-blue-300 underline">
              Bitcoin Connect
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
