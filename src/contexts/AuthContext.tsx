"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/auth-prisma';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const checkAuth = async () => {
    try {
      logger.debug('Checking authentication');
      const response = await fetch('/api/auth/me');

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        logger.debug('Authentication verified', { userId: data.user?.id });
      } else {
        logger.debug('Authentication check failed', { status: response.status });
        setUser(null);
      }
    } catch (error) {
      logger.error('Authentication check failed', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      logger.debug('Login attempt', { username }); // OK to log username, NOT password
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        logger.info('Login successful', { userId: data.user?.id });
        return true;
      }

      logger.debug('Login failed', { status: response.status });
      return false;
    } catch (error) {
      logger.error('Login request failed', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout request failed', error);
      // Still set user to null even if API call fails
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 