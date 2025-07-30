"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserDropdown from './UserDropdown';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                <Image
                  src="/screenshots/logo_square.webp"
                  alt="SubscriptN Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">SubscriptN</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">BTCPay & Bitcoin Shops</span>
              </div>
            </button>
          </div>

          {/* Navigation Links - Removed, now in dropdown menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Future navigation items can go here */}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserDropdown user={user} />
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