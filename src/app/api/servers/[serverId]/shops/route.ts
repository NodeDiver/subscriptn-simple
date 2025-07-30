import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const { serverId } = await params;
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the server belongs to the user using Prisma
    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(serverId),
        ownerId: user.id
      }
    });
    
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Get all shops for this server using Prisma
    const shops = await prisma.shop.findMany({
      where: {
        serverId: parseInt(serverId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get server shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 