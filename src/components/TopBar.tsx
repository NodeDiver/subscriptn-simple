"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserDropdown from './UserDropdown';
import ThemeSwitcher from './ThemeSwitcher';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <nav className="bg-white/95 dark:bg-neutral-900/95 shadow-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
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
                <span className="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">BTCPay & Bitcoin Shops</span>
              </div>
            </button>
          </div>

          {/* Navigation Links - Removed, now in dropdown menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Future navigation items can go here */}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* User Authentication */}
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-slate-600 to-blue-900 hover:from-slate-700 hover:to-blue-900 text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl magnetic-pull glow-effect"
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