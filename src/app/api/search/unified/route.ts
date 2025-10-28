import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { Prisma } from '@prisma/client';
import { PAGINATION, HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';
import { parseIntSafe } from '@/lib/utils';

// Type definitions for search results
interface ProviderConnection {
  id: number;
  name: string;
  service_type: string;
  connection_type?: string;
  status?: string;
}

interface ShopResult {
  id: string;
  shop_id?: number;
  type: 'shop';
  source: 'local' | 'btcmap';
  name: string;
  description?: string | null;
  logo_url?: string | null;
  shop_type?: 'DIGITAL' | 'PHYSICAL';
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  website?: string | null;
  contact_email?: string | null;
  category?: string;
  providers?: ProviderConnection[];
  created_at?: string | Date;
  updated_at?: string | Date;
}

interface InfrastructureResult {
  id: string;
  provider_id: number;
  type: 'infrastructure';
  source: 'local';
  name: string;
  description?: string | null;
  logo_url?: string | null;
  service_type: string;
  website?: string | null;
  contact_email?: string | null;
  connected_shops: number;
  available_slots?: number | null;
  created_at: string | Date;
  updated_at: string | Date;
}

type SearchResult = ShopResult | InfrastructureResult;

interface SearchWhere {
  isPublic?: boolean;
  shopType?: string;
  serviceType?: string;
  OR?: Array<{
    name?: { contains: string; mode: Prisma.QueryMode };
    description?: { contains: string; mode: Prisma.QueryMode };
    address?: { contains: string; mode: Prisma.QueryMode };
  }>;
}

// Unified search for both shops and infrastructure providers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Common search parameters
    const search = searchParams.get('search');
    const countOnly = searchParams.get('countOnly') === 'true'; // For getting accurate total counts
    const limit = parseIntSafe(
      searchParams.get('limit'),
      PAGINATION.DEFAULT_LIMIT,
      { min: 1, max: countOnly ? 10000 : PAGINATION.MAX_LIMIT } // Allow higher limit for counting
    );
    const offset = parseIntSafe(
      searchParams.get('offset'),
      PAGINATION.DEFAULT_OFFSET,
      { min: 0 }
    );
    const type = searchParams.get('type'); // 'all', 'shops', 'infrastructure'
    const serviceType = searchParams.get('serviceType'); // For filtering infrastructure
    const source = searchParams.get('source'); // 'local', 'btcmap', 'all' for shops
    const shopType = searchParams.get('shopType'); // 'digital', 'physical', 'all' for shops

    logger.apiRequest('GET', '/api/search/unified', { search, type, limit, offset, countOnly });

    let results: SearchResult[] = [];

    // Fetch shops if requested
    if (type === 'shops' || type === 'all' || !type) {
      // Fetch local shops
      if (source === 'local' || source === 'all' || !source) {
        const localShops = await fetchLocalShops(search, shopType, limit);
        results.push(...localShops.map(shop => ({
          ...shop,
          type: 'shop' as const,
          source: 'local' as const
        })));
      }

      // Fetch BTCMap shops
      if (source === 'btcmap' || source === 'all' || !source) {
        const btcmapShops = await fetchBTCMapShops(search, shopType, limit);
        results.push(...btcmapShops.map(shop => ({
          ...shop,
          type: 'shop' as const,
          source: 'btcmap' as const
        })));
      }
    }

    // Fetch infrastructure providers if requested
    if (type === 'infrastructure' || type === 'all' || !type) {
      const providers = await fetchInfrastructureProviders(search, serviceType, limit);
      results.push(...providers.map(provider => ({
        ...provider,
        type: 'infrastructure' as const,
        source: 'local' as const
      })));
    }

    // Sort by creation date (newest first)
    results.sort((a: SearchResult, b: SearchResult) => {
      const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
      const dateB = new Date(b.created_at || b.updated_at || 0).getTime();
      return dateB - dateA; // Newest first
    });

    // For "all" view, interleave shops and infrastructure for better variety
    if (type === 'all' || !type) {
      const shops = results.filter((r: SearchResult) => r.type === 'shop');
      const infrastructure = results.filter((r: SearchResult) => r.type === 'infrastructure');
      const interleaved: SearchResult[] = [];
      const maxLength = Math.max(shops.length, infrastructure.length);

      // Interleave with a ratio of 2 shops to 1 infrastructure
      for (let i = 0; i < maxLength; i++) {
        if (i * 2 < shops.length) {
          interleaved.push(shops[i * 2]);
        }
        if (i * 2 + 1 < shops.length) {
          interleaved.push(shops[i * 2 + 1]);
        }
        if (i < infrastructure.length) {
          interleaved.push(infrastructure[i]);
        }
      }

      results = interleaved;
    }

    // Count totals by type
    const shopCount = results.filter((r: SearchResult) => r.type === 'shop').length;
    const infrastructureCount = results.filter((r: SearchResult) => r.type === 'infrastructure').length;
    const localShopCount = results.filter((r: SearchResult) => r.type === 'shop' && r.source === 'local').length;
    const btcmapShopCount = results.filter((r: SearchResult) => r.type === 'shop' && r.source === 'btcmap').length;

    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return NextResponse.json({
      results: paginatedResults,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      counts: {
        shops: shopCount,
        infrastructure: infrastructureCount,
        local_shops: localShopCount,
        btcmap_shops: btcmapShopCount
      }
    });
  } catch (error) {
    logger.error('Unified search failed', error, {
      endpoint: '/api/search/unified'
    });
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      },
      { status: HTTP_STATUS.INTERNAL_ERROR }
    );
  }
}

// Fetch shops from local database
async function fetchLocalShops(search: string | null, shopType: string | null, limit: number = PAGINATION.DEFAULT_LIMIT) {
  const where: SearchWhere = {
    isPublic: true
  };

  // Apply search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { address: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Filter by shop type
  if (shopType && ['DIGITAL', 'PHYSICAL'].includes(shopType.toUpperCase())) {
    where.shopType = shopType.toUpperCase();
  }

  const shops = await prisma.shop.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true
        }
      },
      connections: {
        where: { status: 'ACTIVE' },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              serviceType: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit // Apply proper limit from parameter
  });

  // Transform to unified format
  return shops.map(shop => ({
    id: `local-shop-${shop.id}`,
    shop_id: shop.id,
    name: shop.name,
    description: shop.description,
    logo_url: shop.logoUrl,
    shop_type: shop.shopType,
    address: shop.address,
    latitude: shop.latitude,
    longitude: shop.longitude,
    is_physical_location: shop.isPhysicalLocation,
    website: shop.website,
    contact_email: shop.contactEmail,
    lightning_address: shop.lightningAddress,
    accepts_bitcoin: shop.acceptsBitcoin,
    category: 'local_business',
    owner: shop.owner,
    providers: shop.connections.map(conn => ({
      id: conn.provider.id,
      name: conn.provider.name,
      service_type: conn.provider.serviceType,
      connection_type: conn.connectionType,
      status: conn.status
    })),
    created_at: shop.createdAt,
    updated_at: shop.updatedAt
  }));
}

// Fetch shops from BTCMap API
async function fetchBTCMapShops(search: string | null, shopType: string | null, limit: number = PAGINATION.DEFAULT_LIMIT) {
  try {
    // Build query parameters for BTCMap proxy
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', limit.toString());

    // Call our BTCMap proxy endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/btcmap/elements?${params.toString()}`);

    if (!response.ok) {
      logger.warn('BTCMap proxy request failed', { status: response.status });
      return [];
    }

    const data = await response.json();

    interface BTCMapElement {
      id: string | number;
      name?: string;
      description?: string;
      latitude?: number;
      longitude?: number;
      website?: string;
      updated_at?: string;
      [key: string]: unknown;
    }

    // Map and infer shop type from coordinates
    let btcmapShops = (data.elements || []).map((shop: BTCMapElement) => {
      // Infer shop type: if has coordinates, it's PHYSICAL, otherwise DIGITAL
      const inferredShopType = (shop.latitude && shop.longitude) ? 'PHYSICAL' : 'DIGITAL';

      return {
        ...shop,
        id: `btcmap-shop-${shop.id}`,
        shop_type: inferredShopType,
        created_at: shop.updated_at || new Date().toISOString()
      };
    });

    interface BTCMapShopWithType extends BTCMapElement {
      shop_type: string;
    }

    // Filter by shop type if specified
    if (shopType && ['DIGITAL', 'PHYSICAL'].includes(shopType.toUpperCase())) {
      btcmapShops = btcmapShops.filter((shop: BTCMapShopWithType) => shop.shop_type === shopType.toUpperCase());
    }

    return btcmapShops;
  } catch (error) {
    logger.error('Failed to fetch BTCMap shops', error, { search, shopType, limit });
    return [];
  }
}

// Fetch infrastructure providers from local database
async function fetchInfrastructureProviders(search: string | null, serviceType: string | null, limit: number = PAGINATION.DEFAULT_LIMIT) {
  const where: SearchWhere = {
    isPublic: true
  };

  // Apply search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Filter by service type
  if (serviceType && ['BTCPAY_SERVER', 'BLFS', 'OTHER'].includes(serviceType)) {
    where.serviceType = serviceType;
  }

  const providers = await prisma.infrastructureProvider.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          name: true
        }
      },
      connections: {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          shopId: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit // Apply proper limit from parameter
  });

  // Transform to unified format with available spots calculation
  return providers.map(provider => {
    const connectedShops = provider.connections.length;
    const totalSlots = provider.slotsAvailable || null;
    const availableSlots = totalSlots !== null ? Math.max(0, totalSlots - connectedShops) : null;

    return {
      id: `infrastructure-${provider.id}`,
      provider_id: provider.id,
      name: provider.name,
      description: provider.description,
      logo_url: provider.logoUrl,
      service_type: provider.serviceType,
      website: provider.website,
      contact_email: provider.contactEmail,
      lightning_address: provider.lightningAddress,
      pricing_tiers: provider.pricingTiers,
      technical_specs: provider.technicalSpecs,
      supports_nwc: provider.supportsNwc,
      total_slots: totalSlots,
      connected_shops: connectedShops,
      available_slots: availableSlots,
      owner: provider.owner,
      created_at: provider.createdAt,
      updated_at: provider.updatedAt
    };
  });
}
