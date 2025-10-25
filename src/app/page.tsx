"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Stats {
  providers: number;
  shops: number;
  connections: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ providers: 0, shops: 0, connections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            Bitcoin Infrastructure
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              & Shop Marketplace
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto">
            Connecting providers, shops, and Bitcoiners in one place
          </p>

          {/* Stats Bar */}
          {!loading && (
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stats.providers}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Providers Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stats.shops}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Shops Connected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{stats.connections}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Connections</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Unified Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            Join the Bitcoin Marketplace
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10 max-w-3xl mx-auto">
            List infrastructure services, discover Bitcoin-accepting shops, and build connections in one unified platform
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Register for Bitinfrashop"
            >
              Get Started
            </Link>
            <Link
              href="/discover"
              className="bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-500 px-8 py-4 rounded-xl font-bold text-lg border-2 border-orange-600 dark:border-orange-500 hover:bg-orange-50 dark:hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Discover Bitcoin shops"
            >
              Discover Shops
            </Link>
          </div>

          {/* Unified Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1: List Services */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                List Infrastructure Services
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Payment processors, Lightning nodes, wallet APIs, and more
              </p>
            </div>

            {/* Feature 2: Browse Providers */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Connect to Providers
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Find payment infrastructure with optional NWC subscriptions
              </p>
            </div>

            {/* Feature 3: List Your Shop */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                List Your Shop
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Add your Bitcoin-accepting business to the marketplace
              </p>
            </div>

            {/* Feature 4: Discover Shops */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Discover Bitcoin Shops
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Search businesses accepting Bitcoin payments worldwide
              </p>
            </div>

            {/* Feature 5: Interactive Map */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Interactive Map View
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Explore shops on an interactive map with BTCMap integration
              </p>
            </div>

            {/* Feature 6: Lightning Payments */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Lightning Network Support
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Fast, low-cost payments via Lightning Network and NWC
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-center text-neutral-600 dark:text-neutral-300 mb-16 max-w-2xl mx-auto">
            Join the Bitcoin ecosystem in three simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-orange-600 dark:text-orange-600" aria-label="Step 1">
                1
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Create Account
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Register for free and access all marketplace features
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-orange-600 dark:text-orange-600" aria-label="Step 2">
                2
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                List or Explore
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                List your services or shop, browse infrastructure, or discover Bitcoin businesses
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-orange-600 dark:text-orange-600" aria-label="Step 3">
                3
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Connect & Transact
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Make connections and use Lightning payments for seamless transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 dark:text-white mb-16">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Lightning Payments
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Optional NWC integration for automated subscription payments between shops and providers
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  BTCMap Integration
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Live data from BTCMap merged with our marketplace for comprehensive shop discovery
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Flexible Infrastructure
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Support for BTCPay, BLFS, Lightning nodes, wallet APIs, and other Bitcoin services
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  Simple Connections
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Easy contact exchange between providers and shops - paid subscriptions optional
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-800 to-orange-900 dark:from-orange-900 dark:to-orange-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the Bitcoin Marketplace?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Whether you're providing infrastructure, running a shop, or looking for Bitcoin-accepting businesses
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-white text-orange-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Register for Bitinfrashop marketplace"
            >
              Get Started
            </Link>
            <Link
              href="/discover"
              className="bg-orange-950 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white/20"
              aria-label="Discover Bitcoin-accepting shops"
            >
              Explore Shops
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/screenshots/logo_square.webp"
                    alt="Bitinfrashop Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">Bitinfrashop</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Bitcoin infrastructure and shop marketplace
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/register?role=PROVIDER" className="hover:text-orange-600 dark:hover:text-orange-400">Register</Link></li>
                <li><Link href="/providers" className="hover:text-orange-600 dark:hover:text-orange-400">Browse Providers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">For Shop Owners</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/register?role=SHOP_OWNER" className="hover:text-orange-600 dark:hover:text-orange-400">Register</Link></li>
                <li><Link href="/providers" className="hover:text-orange-600 dark:hover:text-orange-400">Find Infrastructure</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">For Bitcoiners</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/discover" className="hover:text-orange-600 dark:hover:text-orange-400">Discover Shops</Link></li>
                <li><Link href="/register?role=BITCOINER" className="hover:text-orange-600 dark:hover:text-orange-400">Create Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2025 Bitinfrashop. Built with ❤️ for the Bitcoin community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
