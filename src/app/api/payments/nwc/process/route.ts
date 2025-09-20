import { NextRequest, NextResponse } from 'next/server';
import { nwcPaymentService } from '@/lib/nwc-payment-service';
import { getUserById } from '@/lib/auth-prisma';
import { z } from 'zod';

// Validation schema for payment processing
const paymentProcessingSchema = z.object({
  subscriptionId: z.number().int().positive(),
  force: z.boolean().optional().default(false)
});

/**
 * POST /api/payments/nwc/process
 * Process NWC payment for a specific subscription
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const validation = paymentProcessingSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { subscriptionId, force } = validation.data;

    // Verify subscription ownership (unless force is true for admin operations)
    if (!force) {
      // TODO: Add subscription ownership verification
      // For now, allow any authenticated user to process payments
      // In production, this should be restricted to subscription owners
    }

    // Process the payment
    const result = await nwcPaymentService.processRecurringPayment(subscriptionId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        payment: {
          subscriptionId,
          amount: result.amount,
          recipient: result.recipient,
          preimage: result.preimage
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Payment processing failed'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing NWC payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/nwc/process
 * Process all due NWC payments (admin endpoint)
 */
export async function GET(request: NextRequest) {
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

    // TODO: Add admin role check
    // For now, allow any authenticated user to process all payments
    // In production, this should be restricted to admin users

    // Process all due payments
    const results = await nwcPaymentService.processAllDuePayments();

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} payments`,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length
      },
      results
    });

  } catch (error) {
    console.error('Error processing all NWC payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
