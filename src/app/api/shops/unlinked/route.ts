import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const unlinkedShops = await prisma.shop.findMany({
      where: {
        serverLinked: false,
        isPublic: true
      },
      include: {
        owner: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedShops = unlinkedShops.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      lightning_address: shop.lightningAddress,
      subscription_status: shop.subscriptionStatus,
      created_at: shop.createdAt.toISOString(),
      is_public: shop.isPublic,
      server_linked: shop.serverLinked,
      server_name: null, // No server for unlinked shops
      owner_username: shop.owner.username
    }));

    return NextResponse.json({
      shops: formattedShops,
      count: formattedShops.length
    });
  } catch (error) {
    console.error('Get unlinked shops error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unlinked shops' },
      { status: 500 }
    );
  }
}

