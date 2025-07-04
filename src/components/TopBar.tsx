"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useBitcoinConnectContext } from '@/contexts/BitcoinConnectContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function TopBar() {
  const { user, logout } = useAuth();
  const bitcoinConnect = useBitcoinConnectContext();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'provider' ? '/infrastructure' : '/shops';
  };

  const getDashboardName = () => {
    if (!user) return 'Home';
    return user.role === 'provider' ? 'Infrastructure' : 'Shops';
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSidebarOpen(true);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SubscriptN</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {getDashboardName()} Dashboard
                </Link>
                {user.role === 'provider' && (
                  <Link
                    href="/infrastructure/subscriptions"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Subscriptions
                  </Link>
                )}
                {user.role === 'shop_owner' && (
                  <Link
                    href="/shops/add-shop"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Shop
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Bitcoin Connect Button */}
            {bitcoinConnect.isConnected ? (
              <div className="relative group">
                <button
                  onClick={bitcoinConnect.disconnect}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <span>⚡</span>
                  <span>Wallet Connected</span>
                </button>
                {/* Wallet Info Tooltip */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Connected Wallet</h3>
                    {bitcoinConnect.info && (
                      <div className="space-y-1 text-sm text-gray-600">
                        {bitcoinConnect.info.connectorName && (
                          <div>Provider: {bitcoinConnect.info.connectorName}</div>
                        )}
                        {bitcoinConnect.info.connectorType && (
                          <div>Type: {bitcoinConnect.info.connectorType}</div>
                        )}
                        {bitcoinConnect.info.lightningAddress && (
                          <div>Address: {bitcoinConnect.info.lightningAddress}</div>
                        )}
                      </div>
                    )}
                    <button
                      onClick={bitcoinConnect.disconnect}
                      className="mt-3 w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={bitcoinConnect.connect}
                  disabled={bitcoinConnect.connecting}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>⚡</span>
                  <span>{bitcoinConnect.connecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
                {/* Error Tooltip */}
                {bitcoinConnect.error && (
                  <div className="absolute right-0 mt-2 w-64 bg-red-50 border border-red-200 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="text-sm text-red-800">
                      <div className="font-medium mb-1">Connection Error</div>
                      <div>{bitcoinConnect.error}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
  );
} 