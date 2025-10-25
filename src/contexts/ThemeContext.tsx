"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

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
    console.log('Theme effect running:', { theme, mounted });

    if (!mounted) {
      console.log('Not mounted yet, skipping theme application');
      return;
    }

    console.log('Applying theme:', theme);
    console.log('Current classList:', document.documentElement.classList.toString());

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class');
    }

    console.log('New classList:', document.documentElement.classList.toString());

    // Save to localStorage
    localStorage.setItem('bitinfrashop-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('Toggling theme from', prev, 'to', newTheme);
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