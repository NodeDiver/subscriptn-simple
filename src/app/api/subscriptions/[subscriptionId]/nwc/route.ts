import { NextRequest, NextResponse } from 'next/server';
import { nwcService } from '@/lib/nwc-service';
import { nwcSecurity } from '@/lib/nwc-security';
import { validateApiRequest, sanitizeString } from '@/lib/validation';
import { z } from 'zod';
import { getUserById } from '@/lib/auth-prisma';

// Validation schema for NWC connection string
const nwcValidationSchema = z.object({
  nwcConnectionString: z.string()
    .min(1, 'NWC connection string is required')
    .max(500, 'NWC connection string is too long')
    .regex(/^nostr\+walletconnect:\/\/[a-zA-Z0-9+/=]+$/, 'Invalid NWC connection string format')
});

/**
 * POST /api/subscriptions/[subscriptionId]/nwc
 * Store NWC connection string for a subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    // Get authenticated user
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate subscription ID
    const subscriptionId = parseInt(params.subscriptionId);
    if (isNaN(subscriptionId)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }

    // Check security restrictions
    const securityCheck = await nwcSecurity.checkRequestSecurity(
      request,
      'store',
      user.id
    );

    if (!securityCheck.allowed) {
      return NextResponse.json(
        { 
          error: securityCheck.reason || 'Security check failed',
          remainingOperations: securityCheck.remainingOperations
        },
        { status: 429 }
      );
    }

    // Validate request body
    const validation = await validateApiRequest(request, nwcValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { nwcConnectionString } = validation.data;
    const sanitizedConnectionString = sanitizeString(nwcConnectionString as string);

    // Validate NWC connection string format
    if (!nwcService.validateNWCConnectionString(sanitizedConnectionString)) {
      return NextResponse.json(
        { error: 'Invalid NWC connection string format' },
        { status: 400 }
      );
    }

    // Store NWC connection
    const nwcInfo = await nwcService.storeNWCConnection({
      subscriptionId,
      nwcConnectionString: sanitizedConnectionString,
      ownerId: user.id
    });

    return NextResponse.json({
      success: true,
      message: 'NWC connection stored successfully',
      subscriptionId: nwcInfo.subscriptionId
    });

  } catch (error) {
    console.error('Error storing NWC connection:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscriptions/[subscriptionId]/nwc
 * Check if subscription has NWC connection (does not return the actual connection string)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    // Get authenticated user
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate subscription ID
    const subscriptionId = parseInt(params.subscriptionId);
    if (isNaN(subscriptionId)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }

    // Check if NWC connection exists
    const hasConnection = await nwcService.hasNWCConnection(subscriptionId, user.id);

    return NextResponse.json({
      hasConnection,
      subscriptionId
    });

  } catch (error) {
    console.error('Error checking NWC connection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[subscriptionId]/nwc
 * Remove NWC connection from subscription
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    // Get authenticated user
    const userId = request.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserById(parseInt(userId));
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate subscription ID
    const subscriptionId = parseInt(params.subscriptionId);
    if (isNaN(subscriptionId)) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }

    // Remove NWC connection
    await nwcService.removeNWCConnection(subscriptionId, user.id);

    return NextResponse.json({
      success: true,
      message: 'NWC connection removed successfully',
      subscriptionId
    });

  } catch (error) {
    console.error('Error removing NWC connection:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
