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
    
    // Only allow access if the shop is owned by the user
    const shop = await db.get(
        'SELECT id FROM shops WHERE id = ? AND owner_id = ?',
        [params.shopId, user.id]
      );

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
        s.name as shop_name
      FROM subscriptions sub
      JOIN shops s ON sub.shop_id = s.id
      WHERE s.id = ? AND s.owner_id = ?
      ORDER BY sub.created_at DESC
    `, [params.shopId, user.id]);

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get shop subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 