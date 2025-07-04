import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('ZapPlanner webhook received:', body);

    const db = await getDatabase();

    // Handle different webhook events
    switch (body.event) {
      case 'subscription.created':
        await handleSubscriptionCreated(db, body);
        break;
      
      case 'subscription.payment_succeeded':
        await handlePaymentSucceeded(db, body);
        break;
      
      case 'subscription.payment_failed':
        await handlePaymentFailed(db, body);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(db, body);
        break;
      
      default:
        console.log('Unknown webhook event:', body.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionCreated(db: any, data: any) {
  try {
    // Update subscription with ZapPlanner ID
    await db.run(
      'UPDATE subscriptions SET zap_planner_id = ?, status = ? WHERE id = ?',
      [data.subscription_id, 'active', data.metadata?.subscriptionId]
    );

    // Update shop subscription status
    await db.run(
      'UPDATE shops SET subscription_status = ? WHERE id = (SELECT shop_id FROM subscriptions WHERE id = ?)',
      ['active', data.metadata?.subscriptionId]
    );

    console.log('Subscription created:', data.subscription_id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handlePaymentSucceeded(db: any, data: any) {
  try {
    // Record payment in subscription history
    await db.run(
      'INSERT INTO subscription_history (subscription_id, payment_amount, status) VALUES (?, ?, ?)',
      [data.metadata?.subscriptionId, data.amount, 'success']
    );

    console.log('Payment succeeded:', data.subscription_id);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(db: any, data: any) {
  try {
    // Record failed payment
    await db.run(
      'INSERT INTO subscription_history (subscription_id, payment_amount, status) VALUES (?, ?, ?)',
      [data.metadata?.subscriptionId, data.amount, 'failed']
    );

    // Update subscription status to inactive after multiple failures
    const failedPayments = await db.get(
      'SELECT COUNT(*) as count FROM subscription_history WHERE subscription_id = ? AND status = ?',
      [data.metadata?.subscriptionId, 'failed']
    );

    if (failedPayments.count >= 3) {
      await db.run(
        'UPDATE subscriptions SET status = ? WHERE id = ?',
        ['inactive', data.metadata?.subscriptionId]
      );

      // Update shop subscription status
      await db.run(
        'UPDATE shops SET subscription_status = ? WHERE id = (SELECT shop_id FROM subscriptions WHERE id = ?)',
        ['inactive', data.metadata?.subscriptionId]
      );
    }

    console.log('Payment failed:', data.subscription_id);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionCancelled(db: any, data: any) {
  try {
    // Update subscription status
    await db.run(
      'UPDATE subscriptions SET status = ? WHERE zap_planner_id = ?',
      ['cancelled', data.subscription_id]
    );

    // Update shop subscription status
    await db.run(
      'UPDATE shops SET subscription_status = ? WHERE id = (SELECT shop_id FROM subscriptions WHERE zap_planner_id = ?)',
      ['inactive', data.subscription_id]
    );

    console.log('Subscription cancelled:', data.subscription_id);
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
} 