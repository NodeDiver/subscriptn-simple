"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

type UserType = 'server-admin' | 'shop-owner' | 'explorer';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('explorer');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Get user type from URL params or sessionStorage
  useEffect(() => {
    const typeFromUrl = searchParams.get('type') as UserType;
    const typeFromStorage = sessionStorage.getItem('selectedUserType') as UserType;
    
    if (typeFromUrl && ['server-admin', 'shop-owner', 'explorer'].includes(typeFromUrl)) {
      setUserType(typeFromUrl);
    } else if (typeFromStorage && ['server-admin', 'shop-owner', 'explorer'].includes(typeFromStorage)) {
      setUserType(typeFromStorage);
    }
  }, [searchParams]);

  // Redirect when user is authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // If user is already logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'error');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      console.log('Registration form submitted for:', username);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        showToast('Registration successful! Please sign in.', 'success');
        
        // Clear the stored user type
        sessionStorage.removeItem('selectedUserType');
        
        // Redirect to login with user type for post-login redirect
        router.push(`/login?redirect=${encodeURIComponent(getRedirectPath())}`);
      } else {
        setError(data.error || 'Registration failed');
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
      showToast('An error occurred during registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get redirect path based on user type
  const getRedirectPath = (): string => {
    switch (userType) {
      case 'server-admin':
        return '/infrastructure/add-server';
      case 'shop-owner':
        return '/shops/add-shop';
      case 'explorer':
      default:
        return '/';
    }
  };

  // Get user type display info
  const getUserTypeInfo = () => {
    switch (userType) {
      case 'server-admin':
        return {
          title: 'BTCPay Server Administrator',
          description: 'You\'ll be able to add your server after registration',
          color: 'emerald'
        };
      case 'shop-owner':
        return {
          title: 'Shop Owner',
          description: 'You\'ll be able to add your shop after registration',
          color: 'orange'
        };
      case 'explorer':
      default:
        return {
          title: 'Explorer',
          description: 'You can explore the platform and add servers or shops anytime',
          color: 'blue'
        };
    }
  };

  const userTypeInfo = getUserTypeInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Create Account</h1>
          <div className={`inline-block px-4 py-2 rounded-lg mb-3 bg-${userTypeInfo.color}-100 dark:bg-${userTypeInfo.color}-900/20 text-${userTypeInfo.color}-700 dark:text-${userTypeInfo.color}-300`}>
            <span className="text-sm font-medium">{userTypeInfo.title}</span>
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">{userTypeInfo.description}</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div 
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-200"
                placeholder="Choose a username"
                required
                minLength={3}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-200"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 