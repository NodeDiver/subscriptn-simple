import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { prisma } from '@/lib/prisma';

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

    // Verify the subscription belongs to the authenticated user using Prisma
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(subscriptionId),
        shop: {
          ownerId: user.id
        }
      },
      include: {
        shop: {
          select: {
            id: true
          }
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Record the payment in subscription history using Prisma
    const payment = await prisma.subscriptionHistory.create({
      data: {
        subscriptionId: parseInt(subscriptionId),
        paymentAmount: amountSats,
        status,
        paymentMethod,
        walletProvider: walletProvider || null,
        preimage: preimage || null,
        paymentDate: new Date()
      }
    });

    // Update subscription status if payment was successful
    if (status === 'success') {
      await prisma.$transaction([
        prisma.subscription.update({
          where: { id: parseInt(subscriptionId) },
          data: { status: 'active' }
        }),
        prisma.shop.update({
          where: { id: subscription.shop.id },
          data: { subscriptionStatus: 'active' }
        })
      ]);
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        subscriptionId,
        amountSats,
        status,
        paymentMethod,
        walletProvider,
        timestamp: payment.paymentDate.toISOString()
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

    // Verify the subscription belongs to the authenticated user using Prisma
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: parseInt(subscriptionId),
        shop: {
          ownerId: user.id
        }
      }
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Get payment history for this subscription using Prisma
    const payments = await prisma.subscriptionHistory.findMany({
      where: {
        subscriptionId: parseInt(subscriptionId)
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment.id,
        payment_amount: payment.paymentAmount,
        status: payment.status,
        payment_method: payment.paymentMethod,
        wallet_provider: payment.walletProvider,
        preimage: payment.preimage,
        payment_date: payment.paymentDate.toISOString()
      }))
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
  }
} 