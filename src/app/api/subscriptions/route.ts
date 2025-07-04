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
    
    if (user.role === 'provider') {
      // For providers, get all subscriptions on their servers
      const subscriptions = await db.all(`
        SELECT 
          sub.id,
          sub.amount_sats,
          sub.interval,
          sub.status,
          sub.created_at,
          sub.zap_planner_id,
          s.name as shop_name,
          sr.name as server_name,
          u.username as owner_username
        FROM subscriptions sub
        JOIN shops s ON sub.shop_id = s.id
        JOIN servers sr ON s.server_id = sr.id
        JOIN users u ON s.owner_id = u.id
        WHERE sr.provider_id = ?
        ORDER BY sub.created_at DESC
      `, [user.id]);
      
      return NextResponse.json({ subscriptions });
    } else {
      // For shop owners, get their own subscriptions
      const subscriptions = await db.all(`
        SELECT 
          sub.id,
          sub.amount_sats,
          sub.interval,
          sub.status,
          sub.created_at,
          sub.zap_planner_id,
          s.name as shop_name,
          sr.name as server_name
        FROM subscriptions sub
        JOIN shops s ON sub.shop_id = s.id
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.owner_id = ?
        ORDER BY sub.created_at DESC
      `, [user.id]);
      
      return NextResponse.json({ subscriptions });
    }
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
    if (!user || user.role !== 'shop_owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { shopId, amountSats, interval, zapPlannerId } = await request.json();

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

    const result = await db.run(
      'INSERT INTO subscriptions (shop_id, amount_sats, interval, zap_planner_id) VALUES (?, ?, ?, ?)',
      [shopId, amountSats, interval, zapPlannerId || null]
    );

    const newSubscription = await db.get(`
      SELECT 
        sub.id,
        sub.amount_sats,
        sub.interval,
        sub.status,
        sub.created_at,
        sub.zap_planner_id,
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