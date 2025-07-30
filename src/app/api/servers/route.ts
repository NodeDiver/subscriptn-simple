import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth-prisma';
import { getServersWithStats, createServer, deleteServer } from '@/lib/server-prisma';
import { validateApiRequest, serverValidationSchema, sanitizeString } from '@/lib/validation';
import { serverRateLimiter } from '@/lib/rateLimit';

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

    // Get servers using Prisma
    const servers = await getServersWithStats(user.id);

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Get servers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!serverRateLimiter.isAllowed(clientIP)) {
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
    const validation = await validateApiRequest(request, serverValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, host_url, api_key, description, is_public, slots_available, lightning_address } = validation.data;
    const sanitizedName = sanitizeString(name as string);
    const sanitizedHostUrl = sanitizeString(host_url as string);
    const sanitizedApiKey = sanitizeString(api_key as string);
    const sanitizedDescription = description ? sanitizeString(description as string) : null;
    const sanitizedLightningAddress = lightning_address ? sanitizeString(lightning_address as string) : null;
    const isPublic = is_public !== undefined ? Boolean(is_public) : true;
    const slotsAvailable = Number(slots_available) || 21;

    try {
      // Create server using Prisma
      const newServer = await createServer({
        name: sanitizedName,
        hostUrl: sanitizedHostUrl,
        apiKey: sanitizedApiKey,
        ownerId: user.id,
        description: sanitizedDescription,
        isPublic,
        slotsAvailable,
        lightningAddress: sanitizedLightningAddress
      });

      return NextResponse.json({ server: newServer }, { status: 201 });
    } catch (error: any) {
      // Handle Prisma unique constraint errors
      if (error.code === 'P2002' && error.meta?.target?.includes('hostUrl')) {
        return NextResponse.json(
          { error: 'This host URL is already registered' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Create server error:', error);
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
    const serverId = searchParams.get('id');

    if (!serverId) {
      return NextResponse.json({ error: 'Server ID is required' }, { status: 400 });
    }

    // Delete server using Prisma
    const success = await deleteServer(parseInt(serverId), user.id);

    if (!success) {
      return NextResponse.json({ error: 'Server not found or not owned by you' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Server removed successfully. All related shops and subscriptions have been cancelled.' 
    });
  } catch (error) {
    console.error('Delete server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 