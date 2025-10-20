import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Count infrastructure providers
    const providers = await prisma.infrastructureProvider.count({
      where: { isPublic: true }
    });

    // Count shops
    const shops = await prisma.shop.count({
      where: { isPublic: true }
    });

    // Count active connections
    const connections = await prisma.connection.count({
      where: { status: 'ACTIVE' }
    });

    return NextResponse.json({
      providers,
      shops,
      connections
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
