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
        // Professional Bitcoin-focused palette
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#14213D', // Deep navy - main primary
          600: '#0F1A2E', // Darker navy
          700: '#0A1120', // Darkest navy
          800: '#050A10',
          900: '#020508',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F7931A', // Bitcoin orange - main accent
          600: '#E8841A', // Darker orange
          700: '#D9751A', // Darkest orange
          800: '#CA6619',
          900: '#BB5718',
        },
        support: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#2A9D8F', // Professional teal - main support
          600: '#268B7D', // Darker teal
          700: '#22796B', // Darkest teal
          800: '#1E6759',
          900: '#1A5547',
        },
        btcpay: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bce5cd',
          300: '#8dd1a8',
          400: '#56b67d',
          500: '#51B463', // BTCPay Server green - main
          600: '#3d8b54', // Darker green
          700: '#326f45', // Darkest green
          800: '#2b5a3a',
          900: '#254a31',
        },
        neutral: {
          50: '#F4F6F8',  // Light background
          100: '#E5E8EB', // Light border
          200: '#D1D5DB', // Light accent
          300: '#9CA3AF', // Medium light
          400: '#6B7280', // Medium
          500: '#4B5563', // Medium dark
          600: '#374151', // Dark
          700: '#1F2937', // Darker
          800: '#1F2933', // Dark background
          900: '#111827', // Darkest background
        },
        // Legacy support (will be removed gradually)
        'subscriptn': {
          'green': {
            500: '#2D5A3D',
            600: '#16a34a',
          },
          'blue': {
            500: '#1E3A8A',
            600: '#2563eb',
          },
          'teal': {
            500: '#0F766E',
            600: '#0d9488',
          },
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
          backgroundImage: {
            // Professional gradients - minimal usage
            'gradient-primary': 'linear-gradient(135deg, #14213D 0%, #0F1A2E 100%)',
            'gradient-accent': 'linear-gradient(135deg, #F7931A 0%, #E8841A 100%)',
            'gradient-subtle': 'linear-gradient(135deg, #2A9D8F 0%, #268B7D 100%)',
            'gradient-btcpay': 'linear-gradient(135deg, #51B463 0%, #3d8b54 100%)',
            'gradient-dark-green': 'linear-gradient(135deg, #326f45 0%, #2b5a3a 100%)',
            // Dark mode variants
            'gradient-primary-dark': 'linear-gradient(135deg, #14213D 0%, #0A1120 100%)',
            'gradient-accent-dark': 'linear-gradient(135deg, #F7931A 0%, #D9751A 100%)',
            'gradient-subtle-dark': 'linear-gradient(135deg, #2A9D8F 0%, #22796B 100%)',
            'gradient-btcpay-dark': 'linear-gradient(135deg, #51B463 0%, #326f45 100%)',
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