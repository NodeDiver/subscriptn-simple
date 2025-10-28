"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem('bitinfrashop-theme') as ThemeMode | null;

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      // User has a saved preference
      setThemeState(savedTheme);
    } else {
      // First visit - use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) {
      return;
    }

    logger.debug('Applying theme', { theme });

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('bitinfrashop-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      logger.debug('Theme toggled', { from: prev, to: newTheme });
      return newTheme;
    });
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 