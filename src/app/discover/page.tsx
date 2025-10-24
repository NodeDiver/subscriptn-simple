"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shop {
  id: string;
  source: 'local' | 'btcmap';
  name: string;
  description?: string;
  logo_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  contact_email?: string;
  category?: string;
  accepts_bitcoin?: boolean;
  accepts_lightning?: boolean;
  accepts_onchain?: boolean;
  distance?: number;
  providers?: Array<{
    id: number;
    name: string;
    service_type: string;
  }>;
  updated_at?: string;
}

interface SearchResponse {
  shops: Shop[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  sources: {
    local: number;
    btcmap: number;
  };
}

export default function DiscoverPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [source, setSource] = useState<'all' | 'local' | 'btcmap'>('all');
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [radius, setRadius] = useState(50);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });
  const [sources, setSources] = useState({ local: 0, btcmap: 0 });

  // Request user location
  useEffect(() => {
    if (useLocation && !userLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            setUseLocation(false);
          }
        );
      } else {
        console.error('Geolocation not supported');
        setUseLocation(false);
      }
    }
  }, [useLocation, userLocation]);

  // Fetch shops
  useEffect(() => {
    fetchShops();
  }, [search, source, useLocation, userLocation, radius]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (source !== 'all') params.append('source', source);
      if (useLocation && userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lon', userLocation.lon.toString());
        params.append('radius', radius.toString());
      }
      params.append('limit', '50');
      params.append('offset', '0');

      const response = await fetch(`/api/search/shops?${params.toString()}`);
      if (response.ok) {
        const data: SearchResponse = await response.json();
        setShops(data.shops);
        setPagination(data.pagination);
        setSources(data.sources);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Discover Bitcoin Shops
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                Find businesses accepting Bitcoin near you or worldwide
              </p>
            </div>
            <Link
              href="/"
              className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search shops by name, city, or description..."
                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-neutral-900 dark:text-white bg-white dark:bg-neutral-700"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Data Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as 'all' | 'local' | 'btcmap')}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-neutral-900 dark:text-white bg-white dark:bg-neutral-700"
              >
                <option value="all">All Sources</option>
                <option value="local">Local Database</option>
                <option value="btcmap">BTCMap.org</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <input
                  type="checkbox"
                  checked={useLocation}
                  onChange={(e) => setUseLocation(e.target.checked)}
                  className="rounded"
                />
                Use My Location
              </label>
              {useLocation && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {userLocation ? '✓ Location enabled' : 'Requesting location...'}
                </p>
              )}
            </div>

            {/* Radius Filter */}
            {useLocation && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Radius: {radius} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>
              Found <strong className="text-neutral-900 dark:text-white">{pagination.total}</strong> shops
            </span>
            <span>•</span>
            <span>
              <strong className="text-orange-600 dark:text-orange-400">{sources.local}</strong> local
            </span>
            <span>•</span>
            <span>
              <strong className="text-amber-600 dark:text-amber-400">{sources.btcmap}</strong> from BTCMap
            </span>
          </div>
        </div>

        {/* Shop Results */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading shops...</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-neutral-600 dark:text-neutral-400">No shops found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200 p-6"
                >
                  {/* Source Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shop.source === 'local'
                        ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                        : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    }`}>
                      {shop.source === 'local' ? 'Local' : 'BTCMap'}
                    </span>
                    {shop.distance !== undefined && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {shop.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>

                  {/* Shop Name */}
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {shop.name}
                  </h3>

                  {/* Category */}
                  {shop.category && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2 capitalize">
                      {shop.category.replace(/_/g, ' ')}
                    </p>
                  )}

                  {/* Description */}
                  {shop.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                      {shop.description}
                    </p>
                  )}

                  {/* Address */}
                  {shop.address && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3 flex items-start gap-1">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{shop.address}</span>
                    </p>
                  )}

                  {/* Payment Methods */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {shop.accepts_bitcoin && (
                      <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">
                        ₿ Bitcoin
                      </span>
                    )}
                    {shop.accepts_lightning && (
                      <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded">
                        ⚡ Lightning
                      </span>
                    )}
                    {shop.accepts_onchain && (
                      <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">
                        🔗 On-chain
                      </span>
                    )}
                  </div>

                  {/* Website Link */}
                  {shop.website && (
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium transition-colors duration-200"
                    >
                      Visit Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Providers (for local shops) */}
                  {shop.source === 'local' && shop.providers && shop.providers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Connected Providers:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {shop.providers.map((provider) => (
                          <span
                            key={provider.id}
                            className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded"
                          >
                            {provider.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
