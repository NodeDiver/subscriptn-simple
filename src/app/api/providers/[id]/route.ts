import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ServiceType } from '@prisma/client';

// GET /api/providers/[id] - Get single provider details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = parseInt(params.id);
    const userId = request.cookies.get('user_id')?.value;

    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'Invalid provider ID' },
        { status: 400 }
      );
    }

    const provider = await prisma.infrastructureProvider.findUnique({
      where: { id: providerId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true
          }
        },
        connections: {
          where: { status: 'ACTIVE' },
          include: {
            shop: {
              select: {
                id: true,
                name: true,
                website: true
              }
            }
          }
        }
      }
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Check if user can view this provider
    const isOwner = userId && provider.ownerId === parseInt(userId);
    if (!provider.isPublic && !isOwner) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

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
        connected_shops: provider.connections.length,
        shops: provider.connections.map(conn => ({
          id: conn.shop.id,
          name: conn.shop.name,
          website: conn.shop.website,
          connection_type: conn.connectionType,
          status: conn.status
        })),
        owner: provider.owner,
        is_owner: isOwner,
        created_at: provider.createdAt,
        updated_at: provider.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

// PATCH /api/providers/[id] - Update provider
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const providerId = parseInt(params.id);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'Invalid provider ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existingProvider = await prisma.infrastructureProvider.findUnique({
      where: { id: providerId },
      select: { ownerId: true }
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    if (existingProvider.ownerId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'You do not have permission to update this provider' },
        { status: 403 }
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

    // Validate service type if provided
    if (serviceType && !Object.values(ServiceType).includes(serviceType)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (website !== undefined) updateData.website = website;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (lightningAddress !== undefined) updateData.lightningAddress = lightningAddress;
    if (pricingTiers !== undefined) updateData.pricingTiers = pricingTiers;
    if (technicalSpecs !== undefined) updateData.technicalSpecs = technicalSpecs;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (supportsNwc !== undefined) updateData.supportsNwc = supportsNwc;
    if (slotsAvailable !== undefined) updateData.slotsAvailable = slotsAvailable;

    const provider = await prisma.infrastructureProvider.update({
      where: { id: providerId },
      data: updateData,
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
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    );
  }
}

// DELETE /api/providers/[id] - Delete provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const providerId = parseInt(params.id);

    if (isNaN(providerId)) {
      return NextResponse.json(
        { error: 'Invalid provider ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existingProvider = await prisma.infrastructureProvider.findUnique({
      where: { id: providerId },
      select: {
        ownerId: true,
        connections: {
          select: { id: true }
        }
      }
    });

    if (!existingProvider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    if (existingProvider.ownerId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this provider' },
        { status: 403 }
      );
    }

    // Check if there are active connections
    if (existingProvider.connections.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete provider with active shop connections. Please disconnect all shops first.' },
        { status: 400 }
      );
    }

    await prisma.infrastructureProvider.delete({
      where: { id: providerId }
    });

    return NextResponse.json({
      message: 'Provider deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    );
  }
}
