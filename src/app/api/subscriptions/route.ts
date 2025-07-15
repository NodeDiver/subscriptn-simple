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
    
    // Only return subscriptions for shops owned by the user
      const subscriptions = await db.all(`
        SELECT 
          sub.id,
          sub.amount_sats,
          sub.interval,
          sub.status,
          sub.created_at,
          s.name as shop_name,
          sr.name as server_name
        FROM subscriptions sub
        JOIN shops s ON sub.shop_id = s.id
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.owner_id = ?
        ORDER BY sub.created_at DESC
      `, [user.id]);
      return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
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

    const { shopId, amountSats, interval } = await request.json();

    if (!shopId || !amountSats || !interval) {
      return NextResponse.json(
        { error: 'Shop ID, amount, and interval are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify the shop belongs to the user
    const shop = await db.get(
      'SELECT id FROM shops WHERE id = ? AND owner_id = ?',
      [shopId, user.id]
    );
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Check if this shop already has an active subscription
    const existingSubscription = await db.get(
      'SELECT id, status FROM subscriptions WHERE shop_id = ? AND status = ?',
      [shopId, 'active']
    );

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This shop already has an active subscription. Please cancel the existing subscription before creating a new one.' },
        { status: 409 }
      );
    }

    // No active subscription exists for this shop, create new one
    const result = await db.run(
      'INSERT INTO subscriptions (shop_id, amount_sats, interval) VALUES (?, ?, ?)',
      [shopId, amountSats, interval]
    );

    const newSubscription = await db.get(`
      SELECT 
        sub.id,
        sub.amount_sats,
        sub.interval,
        sub.status,
        sub.created_at,
        s.name as shop_name,
        sr.name as server_name
      FROM subscriptions sub
      JOIN shops s ON sub.shop_id = s.id
      JOIN servers sr ON s.server_id = sr.id
      WHERE sub.id = ?
    `, [result.lastID]);

    return NextResponse.json({ subscription: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 