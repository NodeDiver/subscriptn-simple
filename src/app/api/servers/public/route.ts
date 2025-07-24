import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Get all public servers with shop counts
    const servers = await db.all(
      `SELECT 
        s.id, 
        s.name, 
        s.host_url, 
        s.description,
        s.slots_available,
        s.lightning_address,
        s.created_at,
        s.provider_id,
        COALESCE(shop_counts.shop_count, 0) as current_shops,
        (s.slots_available - COALESCE(shop_counts.shop_count, 0)) as available_slots
      FROM servers s 
      LEFT JOIN (
        SELECT server_id, COUNT(*) as shop_count 
        FROM shops 
        WHERE subscription_status = 'active'
        GROUP BY server_id
      ) shop_counts ON s.id = shop_counts.server_id
      WHERE s.is_public = 1
      ORDER BY s.created_at DESC`
    );

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Get public servers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 