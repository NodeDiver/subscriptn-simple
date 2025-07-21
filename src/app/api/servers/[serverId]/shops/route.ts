import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    
    // Verify the server belongs to the provider
    const server = await db.get(
      'SELECT id FROM servers WHERE id = ? AND provider_id = ?',
      [serverId, user.id]
    );

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Get shops on this server
    const shops = await db.all(`
      SELECT 
        s.id, 
        s.name, 
        s.lightning_address, 
        s.subscription_status, 
        s.created_at,
        u.username as owner_username
      FROM shops s
      JOIN users u ON s.owner_id = u.id
      WHERE s.server_id = ?
      ORDER BY s.created_at DESC
    `, [serverId]);

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get server shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 