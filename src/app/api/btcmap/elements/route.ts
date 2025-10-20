import { NextRequest, NextResponse } from 'next/server';

// BTCMap API endpoint
const BTCMAP_API_URL = 'https://static.btcmap.org/api/v2/elements.json';

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
let cachedData: {
  data: any[];
  timestamp: number;
} | null = null;

export interface BTCMapElement {
  id: string;
  osm_json: {
    type: string;
    id: number;
    lat: number;
    lon: number;
    timestamp: string;
    version: number;
    changeset: number;
    user: string;
    uid: number;
    tags: {
      name?: string;
      amenity?: string;
      shop?: string;
      tourism?: string;
      craft?: string;
      office?: string;
      website?: string;
      phone?: string;
      'addr:street'?: string;
      'addr:housenumber'?: string;
      'addr:city'?: string;
      'addr:postcode'?: string;
      'addr:country'?: string;
      description?: string;
      opening_hours?: string;
      'payment:bitcoin'?: string;
      'payment:lightning'?: string;
      'payment:onchain'?: string;
      [key: string]: any;
    };
  };
  tags: {
    category?: string;
    'icon:android'?: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// GET /api/btcmap/elements - Fetch BTCMap elements with caching
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radius = parseFloat(searchParams.get('radius') || '50'); // km

    // Check if cache is valid
    const now = Date.now();
    if (!cachedData || (now - cachedData.timestamp) > CACHE_DURATION) {
      console.log('Fetching fresh data from BTCMap API...');

      const response = await fetch(BTCMAP_API_URL, {
        headers: {
          'User-Agent': 'SubscriptN-Platform/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`BTCMap API error: ${response.status}`);
      }

      const data = await response.json();

      cachedData = {
        data: data,
        timestamp: now
      };

      console.log(`Cached ${data.length} elements from BTCMap`);
    } else {
      console.log('Using cached BTCMap data');
    }

    // Filter out deleted elements
    let elements = cachedData.data.filter((el: BTCMapElement) => !el.deleted_at);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      elements = elements.filter((el: BTCMapElement) => {
        const name = el.osm_json.tags.name?.toLowerCase() || '';
        const city = el.osm_json.tags['addr:city']?.toLowerCase() || '';
        const street = el.osm_json.tags['addr:street']?.toLowerCase() || '';
        const description = el.osm_json.tags.description?.toLowerCase() || '';

        return name.includes(searchLower) ||
               city.includes(searchLower) ||
               street.includes(searchLower) ||
               description.includes(searchLower);
      });
    }

    // Apply category filter
    if (category) {
      elements = elements.filter((el: BTCMapElement) => {
        const amenity = el.osm_json.tags.amenity;
        const shop = el.osm_json.tags.shop;
        const tourism = el.osm_json.tags.tourism;

        return amenity === category || shop === category || tourism === category;
      });
    }

    // Apply location-based filter (if lat/lon provided)
    if (lat && lon) {
      const centerLat = parseFloat(lat);
      const centerLon = parseFloat(lon);

      elements = elements.filter((el: BTCMapElement) => {
        const distance = calculateDistance(
          centerLat,
          centerLon,
          el.osm_json.lat,
          el.osm_json.lon
        );
        return distance <= radius;
      });
    }

    // Count total before pagination
    const total = elements.length;

    // Apply pagination
    const paginatedElements = elements.slice(offset, offset + limit);

    // Transform to our format
    const transformedElements = paginatedElements.map((el: BTCMapElement) => ({
      id: el.id,
      source: 'btcmap',
      name: el.osm_json.tags.name || 'Unknown',
      latitude: el.osm_json.lat,
      longitude: el.osm_json.lon,
      address: formatAddress(el.osm_json.tags),
      city: el.osm_json.tags['addr:city'],
      country: el.osm_json.tags['addr:country'],
      category: el.osm_json.tags.amenity || el.osm_json.tags.shop || el.osm_json.tags.tourism || 'other',
      website: el.osm_json.tags.website,
      phone: el.osm_json.tags.phone,
      description: el.osm_json.tags.description,
      opening_hours: el.osm_json.tags.opening_hours,
      accepts_lightning: el.osm_json.tags['payment:lightning'] === 'yes',
      accepts_onchain: el.osm_json.tags['payment:onchain'] === 'yes',
      accepts_bitcoin: el.osm_json.tags['payment:bitcoin'] === 'yes',
      updated_at: el.updated_at
    }));

    return NextResponse.json({
      elements: transformedElements,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      cached_at: new Date(cachedData.timestamp).toISOString()
    });
  } catch (error) {
    console.error('Error fetching BTCMap data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BTCMap data' },
      { status: 500 }
    );
  }
}

// Helper function to format address from OSM tags
function formatAddress(tags: BTCMapElement['osm_json']['tags']): string {
  const parts = [];

  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  if (tags['addr:country']) parts.push(tags['addr:country']);

  return parts.join(', ') || '';
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
