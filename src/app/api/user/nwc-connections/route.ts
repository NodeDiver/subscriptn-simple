import { NextRequest, NextResponse } from 'next/server';
import { nwcService } from '@/lib/nwc-service';
import { getUserById } from '@/lib/auth-prisma';

/**
 * GET /api/user/nwc-connections
 * Get all NWC connections for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's NWC connections
    const connections = await nwcService.getUserNWCConnections(user.id);

    return NextResponse.json({
      success: true,
      connections,
      total: connections.length
    });

  } catch (error) {
    console.error('Error getting user NWC connections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
