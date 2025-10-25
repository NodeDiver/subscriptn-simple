"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import UserDropdown from './UserDropdown';
import ThemeSwitcher from './ThemeSwitcher';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
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
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              {/* Desktop: Full logo with theme switching */}
              <div className="hidden md:block">
                <Image
                  src={isDark ? "/logos/bitinfrashop-logo-dark.svg" : "/logos/Original-bitinfrashop-logo.svg"}
                  alt="Bitinfrashop"
                  width={240}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </div>

              {/* Tablet: Compact logo */}
              <div className="hidden sm:block md:hidden">
                <Image
                  src={isDark ? "/logos/bitinfrashop-logo-dark.svg" : "/logos/Original-bitinfrashop-logo.svg"}
                  alt="Bitinfrashop"
                  width={180}
                  height={36}
                  className="h-9 w-auto"
                  priority
                />
              </div>

              {/* Mobile: Icon only */}
              <div className="block sm:hidden">
                <Image
                  src="/logos/bitinfrashop-icon.svg"
                  alt="Bitinfrashop"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  priority
                />
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
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl magnetic-pull glow-effect"
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