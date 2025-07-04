import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
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
    
    // Verify the shop belongs to the user or is on their server
    let shop;
    if (user.role === 'provider') {
      shop = await db.get(`
        SELECT s.id FROM shops s
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.id = ? AND sr.provider_id = ?
      `, [params.shopId, user.id]);
    } else {
      shop = await db.get(
        'SELECT id FROM shops WHERE id = ? AND owner_id = ?',
        [params.shopId, user.id]
      );
    }

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Get subscriptions for this shop
    const subscriptions = await db.all(`
      SELECT 
        sub.id,
        sub.amount_sats,
        sub.interval,
        sub.status,
        sub.created_at,
        sub.zap_planner_id
      FROM subscriptions sub
      WHERE sub.shop_id = ?
      ORDER BY sub.created_at DESC
    `, [params.shopId]);

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get shop subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 