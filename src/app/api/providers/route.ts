import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ServiceType } from '@prisma/client';

// GET /api/providers - List all public providers (or user's own providers if authenticated)
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    const searchParams = request.nextUrl.searchParams;

    // Filter parameters
    const serviceType = searchParams.get('serviceType') as ServiceType | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};

    // If user is authenticated, show public providers + their own
    if (userId) {
      where.OR = [
        { isPublic: true },
        { ownerId: parseInt(userId) }
      ];
    } else {
      // Public only for non-authenticated users
      where.isPublic = true;
    }

    // Filter by service type
    if (serviceType && Object.values(ServiceType).includes(serviceType)) {
      where.serviceType = serviceType;
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
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
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Count total for pagination
    const total = await prisma.infrastructureProvider.count({ where });

    // Transform data for response
    const transformedProviders = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      description: provider.description,
      logo_url: provider.logoUrl,
      service_type: provider.serviceType,
      website: provider.website,
      contact_email: provider.contactEmail,
      lightning_address: provider.lightningAddress,
      pricing_tiers: provider.pricingTiers,
      technical_specs: provider.technicalSpecs,
      is_public: provider.isPublic,
      supports_nwc: provider.supportsNwc,
      slots_available: provider.slotsAvailable,
      connected_shops: provider.connections.length,
      owner: {
        id: provider.owner.id,
        username: provider.owner.username,
        name: provider.owner.name
      },
      is_owner: userId ? provider.ownerId === parseInt(userId) : false,
      created_at: provider.createdAt,
      updated_at: provider.updatedAt
    }));

    return NextResponse.json({
      providers: transformedProviders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// POST /api/providers - Create a new provider
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
      serviceType,
      website,
      contactEmail,
      lightningAddress,
      pricingTiers,
      technicalSpecs,
      isPublic,
      supportsNwc,
      slotsAvailable
    } = body;

    // Validation
    if (!name || !serviceType) {
      return NextResponse.json(
        { error: 'Name and service type are required' },
        { status: 400 }
      );
    }

    if (!Object.values(ServiceType).includes(serviceType)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

    // Verify user has PROVIDER role
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true }
    });

    if (!user || user.role !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Only users with PROVIDER role can create infrastructure providers' },
        { status: 403 }
      );
    }

    // Create provider
    const provider = await prisma.infrastructureProvider.create({
      data: {
        name,
        description,
        logoUrl,
        serviceType,
        website,
        contactEmail,
        lightningAddress,
        pricingTiers: pricingTiers || null,
        technicalSpecs: technicalSpecs || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        supportsNwc: supportsNwc || false,
        slotsAvailable: slotsAvailable || null,
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

    return NextResponse.json({
      provider: {
        id: provider.id,
        name: provider.name,
        description: provider.description,
        logo_url: provider.logoUrl,
        service_type: provider.serviceType,
        website: provider.website,
        contact_email: provider.contactEmail,
        lightning_address: provider.lightningAddress,
        pricing_tiers: provider.pricingTiers,
        technical_specs: provider.technicalSpecs,
        is_public: provider.isPublic,
        supports_nwc: provider.supportsNwc,
        slots_available: provider.slotsAvailable,
        owner: provider.owner,
        created_at: provider.createdAt,
        updated_at: provider.updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    );
  }
}
