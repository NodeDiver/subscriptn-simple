"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Shop {
  id: string;
  shop_id?: number;
  type: 'shop';
  source: 'local' | 'btcmap';
  shop_type?: 'DIGITAL' | 'PHYSICAL';
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
  providers?: Array<{
    id: number;
    name: string;
    service_type: string;
  }>;
  updated_at?: string;
  created_at?: string;
}

interface InfrastructureProvider {
  id: string;
  provider_id: number;
  type: 'infrastructure';
  source: 'local';
  name: string;
  description?: string;
  logo_url?: string;
  service_type: 'BTCPAY_SERVER' | 'BLFS' | 'OTHER';
  website?: string;
  contact_email?: string;
  lightning_address?: string;
  pricing_tiers?: any;
  technical_specs?: any;
  supports_nwc?: boolean;
  total_slots?: number | null;
  connected_shops: number;
  available_slots?: number | null;
  owner?: {
    id: number;
    username?: string;
    name?: string;
  };
  created_at: string;
  updated_at: string;
}

type SearchResult = Shop | InfrastructureProvider;

interface SearchResponse {
  results: SearchResult[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  counts: {
    shops: number;
    infrastructure: number;
    local_shops: number;
    btcmap_shops: number;
  };
}

export default function DiscoverPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [viewType, setViewType] = useState<'all' | 'shops' | 'infrastructure'>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [shopTypeFilter, setShopTypeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });
  const [counts, setCounts] = useState({
    shops: 0,
    infrastructure: 0,
    local_shops: 0,
    btcmap_shops: 0
  });

  // Fetch results
  useEffect(() => {
    fetchResults();
  }, [search, viewType, serviceTypeFilter, shopTypeFilter, sourceFilter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('type', viewType);

      // Infrastructure filters
      if (serviceTypeFilter !== 'all' && viewType !== 'shops') {
        params.append('serviceType', serviceTypeFilter);
      }

      // Shop filters
      if (viewType === 'shops' || viewType === 'all') {
        if (shopTypeFilter !== 'all') {
          params.append('shopType', shopTypeFilter);
        }
        if (sourceFilter !== 'all') {
          params.append('source', sourceFilter);
        }
      }

      params.append('limit', '50');
      params.append('offset', '0');

      const response = await fetch(`/api/search/unified?${params.toString()}`);
      if (response.ok) {
        const data: SearchResponse = await response.json();
        setResults(data.results);
        setPagination(data.pagination);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const getServiceTypeName = (type: string) => {
    switch (type) {
      case 'BTCPAY_SERVER':
        return 'BTCPay Server';
      case 'BLFS':
        return 'BLFS';
      case 'OTHER':
        return 'Other';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Discover Bitcoin Marketplace
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                Find shops and infrastructure providers in the Bitcoin ecosystem
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

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setViewType('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                viewType === 'all'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              All ({counts.shops + counts.infrastructure})
            </button>
            <button
              onClick={() => setViewType('shops')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                viewType === 'shops'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Shops Only ({counts.shops})
            </button>
            <button
              onClick={() => setViewType('infrastructure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                viewType === 'infrastructure'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              Infrastructure Only ({counts.infrastructure})
            </button>
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
                placeholder="Search by name or description..."
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

          {/* Filters for Infrastructure */}
          {viewType === 'infrastructure' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Service Type
                </label>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-neutral-900 dark:text-white bg-white dark:bg-neutral-700"
                >
                  <option value="all">All Service Types</option>
                  <option value="BTCPAY_SERVER">BTCPay Server</option>
                  <option value="BLFS">BLFS</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Filters for Shops */}
          {viewType === 'shops' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Shop Type
                </label>
                <select
                  value={shopTypeFilter}
                  onChange={(e) => setShopTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-neutral-900 dark:text-white bg-white dark:bg-neutral-700"
                >
                  <option value="all">All Types</option>
                  <option value="DIGITAL">Digital</option>
                  <option value="PHYSICAL">Real World</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Source
                </label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-neutral-900 dark:text-white bg-white dark:bg-neutral-700"
                >
                  <option value="all">All Sources</option>
                  <option value="local">Local</option>
                  <option value="btcmap">BTCMap</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>
              Found <strong className="text-neutral-900 dark:text-white">{pagination.total}</strong> results
            </span>
            {viewType === 'all' && (
              <>
                <span>•</span>
                <span>
                  <strong className="text-orange-600 dark:text-orange-400">{counts.shops}</strong> shops
                </span>
                <span>•</span>
                <span>
                  <strong className="text-amber-600 dark:text-amber-400">{counts.infrastructure}</strong> infrastructure
                </span>
              </>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-neutral-600 dark:text-neutral-400">No results found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                result.type === 'shop' ? (
                  <ShopCard key={result.id} shop={result} />
                ) : (
                  <InfrastructureCard key={result.id} provider={result} />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Shop Card Component
function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200 p-6">
      {/* Source and Type Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            shop.source === 'local'
              ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
              : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
          }`}>
            {shop.source === 'local' ? 'This App' : 'BTCMap'}
          </span>
          {shop.shop_type && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              shop.shop_type === 'DIGITAL'
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            }`}>
              {shop.shop_type === 'DIGITAL' ? 'Digital' : 'Real World'}
            </span>
          )}
        </div>
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
  );
}

// Infrastructure Provider Card Component
function InfrastructureCard({ provider }: { provider: InfrastructureProvider }) {
  const getServiceTypeName = (type: string) => {
    switch (type) {
      case 'BTCPAY_SERVER': return 'BTCPay Server';
      case 'BLFS': return 'BLFS';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };

  const getPricingText = () => {
    if (!provider.pricing_tiers) return 'Contact for pricing';
    try {
      const pricing = typeof provider.pricing_tiers === 'string'
        ? JSON.parse(provider.pricing_tiers)
        : provider.pricing_tiers;

      if (Array.isArray(pricing) && pricing.length > 0) {
        const firstTier = pricing[0];
        if (firstTier.model === 'free') return 'Free';
        if (firstTier.price) return `From ${firstTier.price}`;
      }
    } catch (e) {
      console.error('Error parsing pricing:', e);
    }
    return 'Contact for pricing';
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-amber-200 dark:border-amber-700/50 hover:shadow-lg transition-all duration-200 p-6">
      {/* Service Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
          {getServiceTypeName(provider.service_type)}
        </span>
        {provider.available_slots !== null && (
          <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
            {provider.available_slots} spots available
          </span>
        )}
      </div>

      {/* Provider Name */}
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
        {provider.name}
      </h3>

      {/* Description */}
      {provider.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
          {provider.description}
        </p>
      )}

      {/* Pricing */}
      <div className="mb-3">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          {getPricingText()}
        </span>
      </div>

      {/* Features */}
      {provider.technical_specs && (
        <div className="mb-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Features:</p>
          <div className="flex flex-wrap gap-1">
            {provider.supports_nwc && (
              <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">
                NWC Support
              </span>
            )}
          </div>
        </div>
      )}

      {/* Connected Shops */}
      <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
        {provider.connected_shops} shop{provider.connected_shops !== 1 ? 's' : ''} connected
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/connect/${provider.provider_id}`}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-center"
        >
          Connect
        </Link>
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium transition-colors duration-200"
          >
            Website
          </a>
        )}
        {!provider.website && provider.contact_email && (
          <a
            href={`mailto:${provider.contact_email}`}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium transition-colors duration-200"
          >
            Contact
          </a>
        )}
      </div>
    </div>
  );
}
