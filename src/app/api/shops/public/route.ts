import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const shops = await db.all(
      `SELECT 
        s.id, s.name, s.lightning_address, s.is_public, s.created_at,
        srv.name as server_name,
        u.username as owner_username,
        COALESCE(sub.status, 'inactive') as subscription_status
      FROM shops s 
      LEFT JOIN servers srv ON s.server_id = srv.id
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN subscriptions sub ON s.id = sub.shop_id AND sub.status = 'active'
      WHERE s.is_public = 1
      ORDER BY s.created_at DESC`
    );
    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get public shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 