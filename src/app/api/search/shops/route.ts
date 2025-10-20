import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Unified shop search combining local DB + BTCMap data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Common search parameters
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = parseFloat(searchParams.get('radius') || '50'); // km
    const source = searchParams.get('source'); // 'local', 'btcmap', or 'all' (default)

    const results = [];

    // Fetch local shops if requested
    if (source === 'local' || source === 'all' || !source) {
      const localShops = await fetchLocalShops(search, lat, lon, radius);
      results.push(...localShops.map(shop => ({
        ...shop,
        source: 'local'
      })));
    }

    // Fetch BTCMap shops if requested
    if (source === 'btcmap' || source === 'all' || !source) {
      const btcmapShops = await fetchBTCMapShops(search, lat, lon, radius);
      results.push(...btcmapShops.map(shop => ({
        ...shop,
        source: 'btcmap'
      })));
    }

    // Sort by distance if location provided, otherwise by name
    if (lat && lon) {
      const centerLat = parseFloat(lat);
      const centerLon = parseFloat(lon);

      results.forEach((shop: any) => {
        if (shop.latitude && shop.longitude) {
          shop.distance = calculateDistance(
            centerLat,
            centerLon,
            shop.latitude,
            shop.longitude
          );
        }
      });

      results.sort((a: any, b: any) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return distA - distB;
      });
    } else {
      results.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
    }

    // Count total
    const total = results.length;

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    return NextResponse.json({
      shops: paginatedResults,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      sources: {
        local: results.filter((r: any) => r.source === 'local').length,
        btcmap: results.filter((r: any) => r.source === 'btcmap').length
      }
    });
  } catch (error) {
    console.error('Error in unified shop search:', error);
    return NextResponse.json(
      { error: 'Failed to search shops' },
      { status: 500 }
    );
  }
}

// Fetch shops from local database
async function fetchLocalShops(
  search: string | null,
  lat: string | null,
  lon: string | null,
  radius: number
) {
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
    orderBy: { createdAt: 'desc' }
  });

  // Filter by location if provided
  let filteredShops = shops;
  if (lat && lon) {
    const centerLat = parseFloat(lat);
    const centerLon = parseFloat(lon);

    filteredShops = shops.filter(shop => {
      if (!shop.latitude || !shop.longitude) return false;

      const distance = calculateDistance(
        centerLat,
        centerLon,
        shop.latitude,
        shop.longitude
      );

      return distance <= radius;
    });
  }

  // Transform to unified format
  return filteredShops.map(shop => ({
    id: `local:${shop.id}`,
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
async function fetchBTCMapShops(
  search: string | null,
  lat: string | null,
  lon: string | null,
  radius: number
) {
  try {
    // Build query parameters for BTCMap proxy
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (lat) params.append('lat', lat);
    if (lon) params.append('lon', lon);
    params.append('radius', radius.toString());
    params.append('limit', '1000'); // Fetch more from BTCMap

    // Call our BTCMap proxy endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/btcmap/elements?${params.toString()}`);

    if (!response.ok) {
      console.error('BTCMap proxy error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    console.error('Error fetching BTCMap shops:', error);
    return [];
  }
}

// Haversine formula to calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
