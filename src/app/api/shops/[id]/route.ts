import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/shops/[id] - Get single shop details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = parseInt(params.id);
    const userId = request.cookies.get('user_id')?.value;

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
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
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                serviceType: true,
                website: true,
                contactEmail: true
              }
            }
          }
        }
      }
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Check if user can view this shop
    const isOwner = userId && shop.ownerId === parseInt(userId);
    if (!shop.isPublic && !isOwner) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
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
        providers: shop.connections.map(conn => ({
          id: conn.provider.id,
          name: conn.provider.name,
          service_type: conn.provider.serviceType,
          website: conn.provider.website,
          contact_email: conn.provider.contactEmail,
          connection_type: conn.connectionType,
          status: conn.status,
          created_at: conn.createdAt
        })),
        is_owner: isOwner,
        created_at: shop.createdAt,
        updated_at: shop.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    );
  }
}

// PATCH /api/shops/[id] - Update shop
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

    const shopId = parseInt(params.id);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { ownerId: true }
    });

    if (!existingShop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    if (existingShop.ownerId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'You do not have permission to update this shop' },
        { status: 403 }
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
      isPublic
    } = body;

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (address !== undefined) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null;
    if (isPhysicalLocation !== undefined) updateData.isPhysicalLocation = isPhysicalLocation;
    if (website !== undefined) updateData.website = website;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (lightningAddress !== undefined) updateData.lightningAddress = lightningAddress;
    if (acceptsBitcoin !== undefined) updateData.acceptsBitcoin = acceptsBitcoin;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const shop = await prisma.shop.update({
      where: { id: shopId },
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
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
}

// DELETE /api/shops/[id] - Delete shop
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

    const shopId = parseInt(params.id);

    if (isNaN(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Check ownership
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        ownerId: true,
        connections: {
          select: { id: true }
        }
      }
    });

    if (!existingShop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    if (existingShop.ownerId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this shop' },
        { status: 403 }
      );
    }

    // Note: Connections will be deleted automatically due to onDelete: Cascade in schema
    await prisma.shop.delete({
      where: { id: shopId }
    });

    return NextResponse.json({
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    );
  }
}
