"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import { useBitcoinConnectHandlers } from '@/contexts/BitcoinConnectContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
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
    // Sidebar functionality removed - logo now just prevents default
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">SubscriptN</span>
                <span className="text-xs text-gray-500 -mt-1">Bitcoin Subs</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link
                  href="/infrastructure"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 relative group"
                >
                  Infrastructure Dashboard
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </Link>
                <Link
                  href="/shops"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 relative group"
                >
                  Shops Dashboard
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
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
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-500">User</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
    </nav>
  );
} 