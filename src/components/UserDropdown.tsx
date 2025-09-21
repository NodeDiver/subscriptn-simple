"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/lib/auth';
import ThemeSwitcher from './ThemeSwitcher';

interface UserDropdownProps {
  user: User;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-green-500 dark:via-teal-500 dark:to-blue-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
          <span className="text-white text-sm font-medium">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">User</div>
        </div>
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-subscriptn-green-500 via-subscriptn-teal-500 to-subscriptn-blue-500 dark:from-green-500 dark:via-teal-500 dark:to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">SubscriptN User</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Browse Servers */}
            <Link
              href="/infrastructure"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-subscriptn-green-50 dark:hover:bg-green-500/10 hover:text-subscriptn-green-600 dark:hover:text-green-400 transition-all duration-200 group"
            >
              <div className="w-5 h-5 text-subscriptn-green-500 dark:text-green-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span>Browse Servers</span>
            </Link>

            {/* Shops Dashboard */}
            <Link
              href="/shops"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-subscriptn-blue-50 dark:hover:bg-blue-500/10 hover:text-subscriptn-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <div className="w-5 h-5 text-subscriptn-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span>Shops Dashboard</span>
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-subscriptn-teal-50 dark:hover:bg-teal-500/10 hover:text-subscriptn-teal-600 dark:hover:text-teal-400 transition-all duration-200 group"
            >
              <div className="w-5 h-5 text-subscriptn-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>Dashboard</span>
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
            >
              <div className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>Settings</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* NWC Management */}
            <Link
              href="/nwc-management"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-subscriptn-purple-50 dark:hover:bg-purple-500/10 hover:text-subscriptn-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
            >
              <div className="w-5 h-5 text-subscriptn-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>NWC Management</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group w-full text-left"
            >
              <div className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform duration-200">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span>Logout</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </div>
  );
} 