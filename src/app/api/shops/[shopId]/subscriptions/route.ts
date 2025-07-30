import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getShopSubscriptions } from '@/lib/subscription-prisma';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the shop belongs to the user first
    const shop = await prisma.shop.findFirst({
      where: {
        id: parseInt(shopId),
        ownerId: user.id
      }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Get subscriptions for this shop using Prisma
    const subscriptions = await getShopSubscriptions(parseInt(shopId));

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get shop subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 