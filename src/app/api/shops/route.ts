import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const db = await getDatabase();
    // Always return only shops owned by the user
      const shops = await db.all(`
        SELECT 
          s.id, 
          s.name, 
          s.lightning_address, 
          s.subscription_status, 
          s.created_at,
          sr.name as server_name
        FROM shops s
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.owner_id = ?
        ORDER BY s.created_at DESC
      `, [user.id]);
      return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, serverId, lightningAddress } = await request.json();

    if (!name || !serverId) {
      return NextResponse.json(
        { error: 'Name and server ID are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify the server exists
    const server = await db.get('SELECT id FROM servers WHERE id = ?', [serverId]);
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const result = await db.run(
      'INSERT INTO shops (name, lightning_address, server_id, owner_id) VALUES (?, ?, ?, ?)',
      [name, lightningAddress || null, serverId, user.id]
    );

    const newShop = await db.get(`
      SELECT 
        s.id, 
        s.name, 
        s.lightning_address, 
        s.subscription_status, 
        s.created_at,
        sr.name as server_name
      FROM shops s
      JOIN servers sr ON s.server_id = sr.id
      WHERE s.id = ?
    `, [result.lastID]);

    return NextResponse.json({ shop: newShop }, { status: 201 });
  } catch (error) {
    console.error('Create shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 