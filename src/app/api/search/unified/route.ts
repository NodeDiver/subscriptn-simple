import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Unified search for both shops and infrastructure providers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Common search parameters
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // 'all', 'shops', 'infrastructure'
    const serviceType = searchParams.get('serviceType'); // For filtering infrastructure
    const source = searchParams.get('source'); // 'local', 'btcmap', 'all' for shops

    const results: any[] = [];

    // Fetch shops if requested
    if (type === 'shops' || type === 'all' || !type) {
      // Fetch local shops
      if (source === 'local' || source === 'all' || !source) {
        const localShops = await fetchLocalShops(search);
        results.push(...localShops.map(shop => ({
          ...shop,
          type: 'shop',
          source: 'local'
        })));
      }

      // Fetch BTCMap shops
      if (source === 'btcmap' || source === 'all' || !source) {
        const btcmapShops = await fetchBTCMapShops(search);
        results.push(...btcmapShops.map(shop => ({
          ...shop,
          type: 'shop',
          source: 'btcmap'
        })));
      }
    }

    // Fetch infrastructure providers if requested
    if (type === 'infrastructure' || type === 'all' || !type) {
      const providers = await fetchInfrastructureProviders(search, serviceType);
      results.push(...providers.map(provider => ({
        ...provider,
        type: 'infrastructure',
        source: 'local'
      })));
    }

    // Sort by creation date (newest first) for "all" view
    results.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
      const dateB = new Date(b.created_at || b.updated_at || 0).getTime();
      return dateB - dateA; // Newest first
    });

    // Count totals by type
    const shopCount = results.filter((r: any) => r.type === 'shop').length;
    const infrastructureCount = results.filter((r: any) => r.type === 'infrastructure').length;
    const localShopCount = results.filter((r: any) => r.type === 'shop' && r.source === 'local').length;
    const btcmapShopCount = results.filter((r: any) => r.type === 'shop' && r.source === 'btcmap').length;

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
    console.error('Error in unified search:', error);
    return NextResponse.json(
      { error: 'Failed to perform unified search' },
      { status: 500 }
    );
  }
}

// Fetch shops from local database
async function fetchLocalShops(search: string | null) {
  const where: any = {
    isPublic: true
  };

  // Apply search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } }
    ];
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
    take: 500 // Fetch more for combined results
  });

  // Transform to unified format
  return shops.map(shop => ({
    id: `local-shop-${shop.id}`,
    shop_id: shop.id,
    name: shop.name,
    description: shop.description,
    logo_url: shop.logoUrl,
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
async function fetchBTCMapShops(search: string | null) {
  try {
    // Build query parameters for BTCMap proxy
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', '500');

    // Call our BTCMap proxy endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/btcmap/elements?${params.toString()}`);

    if (!response.ok) {
      console.error('BTCMap proxy error:', response.status);
      return [];
    }

    const data = await response.json();
    return (data.elements || []).map((shop: any) => ({
      ...shop,
      id: `btcmap-shop-${shop.id}`,
      created_at: shop.updated_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching BTCMap shops:', error);
    return [];
  }
}

// Fetch infrastructure providers from local database
async function fetchInfrastructureProviders(search: string | null, serviceType: string | null) {
  const where: any = {
    isPublic: true
  };

  // Apply search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
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
    take: 500 // Fetch more for combined results
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
