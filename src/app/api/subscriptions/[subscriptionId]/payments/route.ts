import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { subscriptionId } = await params;
    const { amountSats, status, paymentMethod, walletProvider, preimage } = await request.json();

    // Validate input
    if (!amountSats || !status || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDatabase();

    // Verify the subscription belongs to the authenticated user
    const subscription = await db.get(`
      SELECT s.id, s.shop_id, sh.owner_id 
      FROM subscriptions s 
      JOIN shops sh ON s.shop_id = sh.id 
      WHERE s.id = ? AND sh.owner_id = ?
    `, [subscriptionId, user.id]);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Record the payment in subscription history
    const result = await db.run(`
      INSERT INTO subscription_history (
        subscription_id, 
        payment_amount, 
        status, 
        payment_method,
        wallet_provider,
        preimage
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [subscriptionId, amountSats, status, paymentMethod, walletProvider || null, preimage || null]);

    // Update subscription status if payment was successful
    if (status === 'success') {
      await db.run(`
        UPDATE subscriptions 
        SET status = 'active' 
        WHERE id = ?
      `, [subscriptionId]);

      // Update shop subscription status
      await db.run(`
        UPDATE shops 
        SET subscription_status = 'active' 
        WHERE id = ?
      `, [subscription.shop_id]);
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: result.lastID,
        subscriptionId,
        amountSats,
        status,
        paymentMethod,
        walletProvider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { subscriptionId } = await params;
    const db = await getDatabase();

    // Verify the subscription belongs to the authenticated user
    const subscription = await db.get(`
      SELECT s.id, s.shop_id, sh.owner_id 
      FROM subscriptions s 
      JOIN shops sh ON s.shop_id = sh.id 
      WHERE s.id = ? AND sh.owner_id = ?
    `, [subscriptionId, user.id]);

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Get payment history for this subscription
    const payments = await db.all(`
      SELECT 
        id,
        payment_amount,
        status,
        payment_method,
        wallet_provider,
        preimage,
        payment_date
      FROM subscription_history 
      WHERE subscription_id = ? 
      ORDER BY payment_date DESC
    `, [subscriptionId]);

    return NextResponse.json({
      success: true,
      payments: payments.map(payment => ({
        ...payment,
        payment_date: new Date(payment.payment_date).toISOString()
      }))
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
  }
} 