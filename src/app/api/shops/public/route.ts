import { NextRequest, NextResponse } from 'next/server';
import { getPublicShops } from '@/lib/shop-prisma';

export async function GET(request: NextRequest) {
  try {
    // Get public shops using Prisma
    const shops = await getPublicShops();
    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get public shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 