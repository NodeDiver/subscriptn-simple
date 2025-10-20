import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/shops - List all public shops (or user's own shops if authenticated)
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    const searchParams = request.nextUrl.searchParams;

    // Filter parameters
    const search = searchParams.get('search');
    const hasProvider = searchParams.get('hasProvider'); // 'true' or 'false'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    // If user is authenticated, show public shops + their own
    if (userId) {
      where.OR = [
        { isPublic: true },
        { ownerId: parseInt(userId) }
      ];
    } else {
      // Public only for non-authenticated users
      where.isPublic = true;
    }

    // Search by name, description, or address
    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
    }

    // Filter by connection status
    if (hasProvider === 'true') {
      where.connections = {
        some: {
          status: 'ACTIVE'
        }
      };
    } else if (hasProvider === 'false') {
      where.connections = {
        none: {}
      };
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
      take: limit,
      skip: offset
    });

    // Count total for pagination
    const total = await prisma.shop.count({ where });

    // Transform data for response
    const transformedShops = shops.map(shop => ({
      id: shop.id,
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
      is_public: shop.isPublic,
      owner: {
        id: shop.owner.id,
        username: shop.owner.username,
        name: shop.owner.name
      },
      providers: shop.connections.map(conn => ({
        id: conn.provider.id,
        name: conn.provider.name,
        service_type: conn.provider.serviceType,
        connection_type: conn.connectionType,
        status: conn.status
      })),
      is_owner: userId ? shop.ownerId === parseInt(userId) : false,
      created_at: shop.createdAt,
      updated_at: shop.updatedAt
    }));

    return NextResponse.json({
      shops: transformedShops,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}

// POST /api/shops - Create a new shop
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      logoUrl,
      address,
      latitude,
      longitude,
      isPhysicalLocation,
      website,
      contactEmail,
      lightningAddress,
      acceptsBitcoin,
      isPublic,
      providerId // Optional: connect to a provider immediately
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Shop name is required' },
        { status: 400 }
      );
    }

    // Verify user has SHOP_OWNER role
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true }
    });

    if (!user || user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { error: 'Only users with SHOP_OWNER role can create shops' },
        { status: 403 }
      );
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        logoUrl,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        isPhysicalLocation: isPhysicalLocation || false,
        website,
        contactEmail,
        lightningAddress,
        acceptsBitcoin: acceptsBitcoin !== undefined ? acceptsBitcoin : true,
        isPublic: isPublic !== undefined ? isPublic : true,
        ownerId: parseInt(userId)
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    });

    // If providerId is provided, create connection
    if (providerId) {
      await prisma.connection.create({
        data: {
          shopId: shop.id,
          providerId: parseInt(providerId),
          connectionType: 'FREE_LISTING', // Default to free listing
          status: 'PENDING'
        }
      });
    }

    return NextResponse.json({
      shop: {
        id: shop.id,
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
        is_public: shop.isPublic,
        owner: shop.owner,
        created_at: shop.createdAt,
        updated_at: shop.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    );
  }
}
