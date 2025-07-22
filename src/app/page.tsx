"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SubscriptN
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners. 
            Streamline recurring payments and server management in one platform.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BTCPay Server Providers Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                BTCPay Server Providers
              </h2>
              <p className="text-gray-600">
                Manage your BTCPay Server infrastructure, monitor shops, and handle subscriptions. 
                Perfect for infrastructure owners and server administrators.
              </p>
            </div>
            <Link 
              href="/infrastructure"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Access Provider Dashboard
            </Link>
          </div>

          {/* Shop Owners Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Shop Owners
              </h2>
              <p className="text-gray-600">
                Manage your shops, create new subscriptions to BTCPay Server providers, 
                and track your payment history. Ideal for merchants and shop operators.
              </p>
            </div>
            <Link 
              href="/shops"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
            >
              Access Shop Dashboard
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Powered by{' '}
            <a href="https://btcpayserver.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              BTCPay Server
            </a>
            ,{' '}
            <a href="https://lightning.network" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              lightning network
            </a>
            ,{' '}
            <a href="https://nwc.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              NWC
            </a>
            , and{' '}
            <a href="https://bitcoin-connect.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              Bitcoin Connect
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
