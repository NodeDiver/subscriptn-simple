import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';
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

    const db = await getDatabase();
    // Always return only shops owned by the user
      const shops = await db.all(`
        SELECT 
          s.id, 
          s.name, 
          s.lightning_address, 
          s.subscription_status, 
          s.created_at,
          sr.name as server_name
        FROM shops s
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.owner_id = ?
        ORDER BY s.created_at DESC
      `, [user.id]);
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

    const { name, server_id, lightning_address } = validation.data;
    const sanitizedName = sanitizeString(name as string);
    const sanitizedLightningAddress = lightning_address ? sanitizeString(lightning_address as string) : null;
    const serverId = Number(server_id);

    const db = await getDatabase();
    
    // Verify the server exists
    const server = await db.get('SELECT id FROM servers WHERE id = ?', [serverId]);
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Check if this shop name already exists on this server
    const existingShop = await db.get(
      'SELECT id, owner_id FROM shops WHERE name = ? AND server_id = ?',
      [name, serverId]
    );

    if (existingShop) {
      // Check if the current user already owns this shop
      if (existingShop.owner_id === user.id) {
        return NextResponse.json(
          { error: 'You already own a shop with this name on this server' },
          { status: 400 }
        );
      } else {
        // Another user owns this shop
        return NextResponse.json(
          { error: 'This shop is already owned by another user' },
          { status: 409 }
        );
      }
    }

    // No existing shop with this name on this server, create new one
    const result = await db.run(
      'INSERT INTO shops (name, lightning_address, server_id, owner_id) VALUES (?, ?, ?, ?)',
      [sanitizedName, sanitizedLightningAddress, serverId, user.id]
    );

    const newShop = await db.get(`
      SELECT 
        s.id, 
        s.name, 
        s.lightning_address, 
        s.subscription_status, 
        s.created_at,
        sr.name as server_name
      FROM shops s
      JOIN servers sr ON s.server_id = sr.id
      WHERE s.id = ?
    `, [result.lastID]);

    return NextResponse.json({ shop: newShop }, { status: 201 });
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

    const db = await getDatabase();
    
    // Check if the shop exists and is owned by the current user
    const shop = await db.get(
      'SELECT id, name FROM shops WHERE id = ? AND owner_id = ?',
      [shopId, user.id]
    );

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found or not owned by you' }, { status: 404 });
    }

    // Delete related subscriptions first (cascade delete)
    await db.run('DELETE FROM subscriptions WHERE shop_id = ?', [shopId]);
    
    // Delete related subscription history
    await db.run(`
      DELETE FROM subscription_history 
      WHERE subscription_id IN (SELECT id FROM subscriptions WHERE shop_id = ?)
    `, [shopId]);

    // Delete the shop
    await db.run('DELETE FROM shops WHERE id = ?', [shopId]);

    return NextResponse.json({ 
      message: 'Shop removed successfully. All related subscriptions and payments have been cancelled.' 
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 