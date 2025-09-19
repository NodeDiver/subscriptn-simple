import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getUserShops, createShop, deleteShop } from '@/lib/shop-prisma';
import { validateApiRequest, shopValidationSchema, sanitizeString } from '@/lib/validation';
import { shopRateLimiter } from '@/lib/rateLimit';

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

    // Get user shops using Prisma
    const shops = await getUserShops(user.id);
    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get shops error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!shopRateLimiter.isAllowed(clientIP)) {
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
    const validation = await validateApiRequest(request, shopValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, server_id, lightning_address, is_public } = validation.data;
    const sanitizedName = sanitizeString(name as string);
    const sanitizedLightningAddress = lightning_address ? sanitizeString(lightning_address as string) : null;
    const serverId = Number(server_id);
    const isPublic = is_public !== undefined ? Boolean(is_public) : true;

    try {
      // Create shop using Prisma
      const newShop = await createShop({
        name: sanitizedName,
        serverId,
        ownerId: user.id,
        lightningAddress: sanitizedLightningAddress || undefined,
        isPublic
      });

      return NextResponse.json({ shop: newShop }, { status: 201 });
    } catch (error: any) {
      // Handle specific error messages from Prisma service
      if (error.message === 'Server not found') {
        return NextResponse.json({ error: 'Server not found' }, { status: 404 });
      } else if (error.message === 'You already own a shop with this name on this server') {
        return NextResponse.json(
          { error: 'You already own a shop with this name on this server' },
          { status: 400 }
        );
      } else if (error.message === 'This shop is already owned by another user') {
        return NextResponse.json(
          { error: 'This shop is already owned by another user' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Create shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('id');

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    // Delete shop using Prisma
    const success = await deleteShop(parseInt(shopId), user.id);

    if (!success) {
      return NextResponse.json({ error: 'Shop not found or not owned by you' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Shop removed successfully. All related subscriptions and payments have been cancelled.' 
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 