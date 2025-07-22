/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SubscriptN Brand Colors
        'subscriptn': {
          // Primary Colors
          'green': {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#2D5A3D', // Primary green
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          'blue': {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#1E3A8A', // Primary blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          'teal': {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#0F766E', // Primary teal
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          // Dark mode variants
          'dark': {
            'green': '#10B981',
            'blue': '#3B82F6',
            'teal': '#14B8A6',
            'light-green': '#34D399',
            'light-blue': '#60A5FA',
          }
        },
        // Background colors
        background: {
          light: '#ffffff',
          dark: '#111827',
        },
        surface: {
          light: '#f9fafb',
          dark: '#1f2937',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2D5A3D 0%, #1E3A8A 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0F766E 0%, #86EFAC 100%)',
        'gradient-logo': 'linear-gradient(135deg, #2D5A3D 0%, #0F766E 50%, #1E3A8A 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        'gradient-accent-dark': 'linear-gradient(135deg, #14B8A6 0%, #34D399 100%)',
        'gradient-logo-dark': 'linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #3B82F6 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 