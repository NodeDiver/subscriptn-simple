"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ConnectWalletButton from './ConnectWalletButton';
import { useBitcoinConnectHandlers } from '@/contexts/BitcoinConnectContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { onConnect, onDisconnect } = useBitcoinConnectHandlers();

  // Dynamically import the Bitcoin Connect web component on mount
  useEffect(() => {
    import('@getalby/bitcoin-connect');
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
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
                  href="/infrastructure"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Infrastructure Dashboard
                </Link>
                <Link
                  href="/shops"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Shops Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Bitcoin Connect Button (official web component) */}
            <div className="px-2">
              <ConnectWalletButton onConnect={onConnect} onDisconnect={onDisconnect} />
            </div>
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
                    {/* No role shown */}
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