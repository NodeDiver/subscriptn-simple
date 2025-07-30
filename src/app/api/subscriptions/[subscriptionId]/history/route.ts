import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getSubscriptionHistory } from '@/lib/subscription-prisma';

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

    // Get subscription history using Prisma
    const history = await getSubscriptionHistory(parseInt(subscriptionId), user.id);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Get subscription history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 