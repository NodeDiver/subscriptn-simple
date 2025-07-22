"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import { useBitcoinConnectHandlers } from '@/contexts/BitcoinConnectContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { onConnect, onDisconnect } = useBitcoinConnectHandlers();
  const [isDark, setIsDark] = useState(false);

  // Dynamically import the Bitcoin Connect web component on mount
  useEffect(() => {
    import('@getalby/bitcoin-connect');
  }, []);

  // Check initial theme state
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    // Save preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('subscriptn-theme', isDarkMode ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-green-500 dark:via-teal-500 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">SubscriptN</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">BTCPay & Bitcoin Shops</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link
                  href="/infrastructure"
                  className="text-gray-700 dark:text-gray-300 hover:text-subscriptn-green-500 dark:hover:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-subscriptn-green-50 dark:hover:bg-green-500/10 relative group"
                >
                  Infrastructure Dashboard
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-subscriptn-green-500 dark:bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </Link>
                <Link
                  href="/shops"
                  className="text-gray-700 dark:text-gray-300 hover:text-subscriptn-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-subscriptn-blue-50 dark:hover:bg-blue-500/10 relative group"
                >
                  Shops Dashboard
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-subscriptn-blue-500 dark:bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-subscriptn-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Bitcoin Connect Button (official web component) */}
            <div className="px-2">
              <ConnectWalletButton onConnect={onConnect} onDisconnect={onDisconnect} />
            </div>
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">User</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-subscriptn-green-500 to-subscriptn-blue-500 dark:from-green-500 dark:to-blue-500 text-white px-6 py-2 rounded-lg hover:from-subscriptn-teal-500 hover:to-subscriptn-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-500 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
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