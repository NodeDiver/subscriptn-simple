import type { Metadata } from 'next';
import { Manrope, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SessionProvider from '@/components/SessionProvider';
import TopBar from '@/components/TopBar';
import ErrorBoundary from '@/components/ErrorBoundary';
import HydrationFix from '@/components/HydrationFix';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SubscriptN - Bitcoin Subscription Management',
  description: 'Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners',
  icons: {
    icon: '/screenshots/logo_square.webp',
    shortcut: '/screenshots/logo_square.webp',
    apple: '/screenshots/logo_square.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme flash prevention script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('subscriptn-theme');
                  if (!theme) {
                    // First visit - use system preference
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
              <body className={`${manrope.variable} ${robotoMono.variable}`} suppressHydrationWarning>
        <HydrationFix />
        <ErrorBoundary>
          <SessionProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <div className="min-h-screen bg-white dark:bg-gray-900">
                    <TopBar />
                    <main className="flex-1">
                      {children}
                    </main>
                  </div>
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}