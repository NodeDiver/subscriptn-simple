import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getUserSubscriptions, createSubscription } from '@/lib/subscription-prisma';
import { validateApiRequest, subscriptionValidationSchema } from '@/lib/validation';
import { subscriptionRateLimiter } from '@/lib/rateLimit';

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

    // Get user subscriptions using Prisma
    const subscriptions = await getUserSubscriptions(user.id);
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!subscriptionRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate input
    const validation = await validateApiRequest(request, subscriptionValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { shop_id, amount_sats, interval } = validation.data;
    const shopId = Number(shop_id);
    const amountSats = Number(amount_sats);

    try {
      // Create subscription using Prisma
      const newSubscription = await createSubscription({
        shopId,
        ownerId: user.id,
        amountSats,
        interval: interval as string
      });

      return NextResponse.json({ subscription: newSubscription }, { status: 201 });
    } catch (error: any) {
      // Handle specific error messages from Prisma service
      if (error.message === 'Shop not found') {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      } else if (error.message.includes('already has an active subscription')) {
        return NextResponse.json(
          { error: 'This shop already has an active subscription. Please cancel the existing subscription before creating a new one.' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 