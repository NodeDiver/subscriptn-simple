import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function GET(
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const db = await getDatabase();
    
    // Only allow access if the subscription is for a shop owned by the user
    const subscription = await db.get(`
        SELECT sub.id
        FROM subscriptions sub
        JOIN shops s ON sub.shop_id = s.id
        WHERE sub.id = ? AND s.owner_id = ?
      `, [subscriptionId, user.id]);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Get payment history
    const history = await db.all(`
      SELECT id, payment_amount, status, created_at
      FROM subscription_history
      WHERE subscription_id = ?
      ORDER BY created_at DESC
    `, [subscriptionId]);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Get subscription history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 