import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { BitcoinConnectProvider } from '@/contexts/BitcoinConnectContext';
import { ToastProvider } from '@/contexts/ToastContext';
import TopBar from '@/components/TopBar';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SubscriptN - Bitcoin Subscription Management',
  description: 'Manage Bitcoin subscriptions for BTCPay Server infrastructure and shop owners',
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
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <BitcoinConnectProvider>
              <ToastProvider>
                <div className="min-h-screen bg-white dark:bg-gray-900">
                  <TopBar />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </ToastProvider>
            </BitcoinConnectProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}