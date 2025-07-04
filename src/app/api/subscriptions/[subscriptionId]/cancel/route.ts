import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user || user.role !== 'shop_owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    
    // Verify the subscription belongs to the user
    const subscription = await db.get(`
      SELECT sub.id, sub.zap_planner_id, sub.status
      FROM subscriptions sub
      JOIN shops s ON sub.shop_id = s.id
      WHERE sub.id = ? AND s.owner_id = ?
    `, [params.subscriptionId, user.id]);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (subscription.status === 'cancelled') {
      return NextResponse.json({ error: 'Subscription already cancelled' }, { status: 400 });
    }

    // Update subscription status
    await db.run(
      'UPDATE subscriptions SET status = ? WHERE id = ?',
      ['cancelled', params.subscriptionId]
    );

    // Update shop subscription status
    await db.run(
      'UPDATE shops SET subscription_status = ? WHERE id = (SELECT shop_id FROM subscriptions WHERE id = ?)',
      ['inactive', params.subscriptionId]
    );

    // If there's a ZapPlanner ID, we would ideally call their API to cancel the subscription
    // For now, we'll just update our database
    if (subscription.zap_planner_id) {
      console.log('Should cancel ZapPlanner subscription:', subscription.zap_planner_id);
      // TODO: Call ZapPlanner API to cancel subscription
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 