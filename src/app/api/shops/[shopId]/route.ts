import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getShopById } from '@/lib/shop-prisma';

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

    // Get shop using Prisma
    const shop = await getShopById(parseInt(shopId), user.id);

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Get shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 