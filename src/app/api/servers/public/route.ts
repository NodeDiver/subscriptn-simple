import { NextRequest, NextResponse } from 'next/server';
import { getPublicServers } from '@/lib/server-prisma';

export async function GET(request: NextRequest) {
  try {
    // Get public servers using Prisma
    const servers = await getPublicServers();

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Get public servers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 