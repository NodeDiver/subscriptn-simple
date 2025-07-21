import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const { subscriptionId } = await params;
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    
    // Get subscription details
    const subscription = await db.get(`
      SELECT sub.id, sub.status
      FROM subscriptions sub
      JOIN shops s ON sub.shop_id = s.id
      WHERE sub.id = ? AND s.owner_id = ?
    `, [subscriptionId, user.id]);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.status === 'cancelled') {
      return NextResponse.json({ error: 'Subscription already cancelled' }, { status: 400 });
    }

    // Cancel the subscription in our database
    await db.run(
      'UPDATE subscriptions SET status = ? WHERE id = ?',
      ['cancelled', subscriptionId]
    );

    // Update shop subscription status
    await db.run(
      'UPDATE shops SET subscription_status = ? WHERE id = (SELECT shop_id FROM subscriptions WHERE id = ?)',
      ['inactive', subscriptionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 