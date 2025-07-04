import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
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
    
    let shop;
    if (user.role === 'provider') {
      // For providers, get shop if it's on one of their servers
      shop = await db.get(`
        SELECT 
          s.id, 
          s.name, 
          s.lightning_address, 
          s.subscription_status, 
          s.created_at,
          sr.name as server_name
        FROM shops s
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.id = ? AND sr.provider_id = ?
      `, [params.shopId, user.id]);
    } else {
      // For shop owners, get their own shop
      shop = await db.get(`
        SELECT 
          s.id, 
          s.name, 
          s.lightning_address, 
          s.subscription_status, 
          s.created_at,
          sr.name as server_name
        FROM shops s
        JOIN servers sr ON s.server_id = sr.id
        WHERE s.id = ? AND s.owner_id = ?
      `, [params.shopId, user.id]);
    }

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Get shop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 