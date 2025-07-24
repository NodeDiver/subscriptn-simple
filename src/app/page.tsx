"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-subscriptn-green-50 via-subscriptn-teal-50 to-subscriptn-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-green-500 dark:via-teal-500 dark:to-blue-500 bg-clip-text text-transparent">
                SubscriptN
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners. Streamline recurring payments and server management in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                // User is logged in - show dashboard links
                <>
                  <Link
                    href="/infrastructure"
                    className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 text-white px-8 py-3 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-500 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/shops"
                    className="border-2 border-subscriptn-blue-500 dark:border-blue-500 text-subscriptn-blue-500 dark:text-blue-400 px-8 py-3 rounded-lg hover:bg-subscriptn-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all duration-200 text-lg font-medium"
                  >
                    Browse Shops
                  </Link>
                </>
              ) : (
                // User is not logged in - show auth options
                <>
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 text-white px-8 py-3 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-500 transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="border-2 border-subscriptn-blue-500 dark:border-blue-500 text-subscriptn-blue-500 dark:text-blue-400 px-8 py-3 rounded-lg hover:bg-subscriptn-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all duration-200 text-lg font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Whether you're providing BTCPay Server infrastructure or running a shop, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* BTCPay Server Providers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">BTCPay Server Providers</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  List your BTCPay Server infrastructure and manage subscriptions from shop owners. Earn recurring revenue while providing reliable Bitcoin payment processing services.
                </p>
              </div>
              <Link
                href="/infrastructure"
                className="block w-full bg-blue-600 dark:bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
              >
                Browse Servers
              </Link>
            </div>

            {/* Shop Owners */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Shop Owners</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Subscribe to BTCPay Server infrastructure and manage your Bitcoin payment processing. Find reliable providers and streamline your payment operations.
                </p>
              </div>
              <Link
                href="/shops"
                className="block w-full bg-green-600 dark:bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
              >
                Browse Shops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-green-500 dark:via-teal-500 dark:to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">SubscriptN</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Streamlining Bitcoin subscription management for BTCPay Server infrastructure and shop owners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">For Providers</h4>
              <ul className="space-y-2">
                <li><Link href="/infrastructure" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-green-500 dark:hover:text-green-400">Browse Servers</Link></li>
                <li><Link href="/infrastructure/add-server" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-green-500 dark:hover:text-green-400">Add Server</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">For Shops</h4>
              <ul className="space-y-2">
                <li><Link href="/shops" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-blue-500 dark:hover:text-blue-400">Shops Dashboard</Link></li>
                <li><Link href="/shops/add-shop" className="text-gray-600 dark:text-gray-300 hover:text-subscriptn-blue-500 dark:hover:text-blue-400">Add Shop</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © 2024 SubscriptN. Built for the Bitcoin ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
