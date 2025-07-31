import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getServerById, getServerByIdForDetails, deleteServer } from '@/lib/server-prisma';

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

    // Get server using Prisma - show any server and determine ownership
    const server = await getServerByIdForDetails(parseInt(serverId), user.id);

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    return NextResponse.json({ server });
  } catch (error) {
    console.error('Get server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

export async function DELETE(
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete server using Prisma
    const success = await deleteServer(parseInt(serverId), user.id);

    if (!success) {
      return NextResponse.json({ error: 'Server not found or not owned by you' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Server removed successfully. All related shops and subscriptions have been cancelled.' 
    });
  } catch (error) {
    console.error('Delete server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 