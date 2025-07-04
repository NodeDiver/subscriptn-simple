import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user || user.role !== 'provider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const servers = await db.all(
      'SELECT id, name, host_url, created_at FROM servers WHERE provider_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Get servers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(parseInt(userId));
    if (!user || user.role !== 'provider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, hostUrl, apiKey } = await request.json();

    if (!name || !hostUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Name, host URL, and API key are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.run(
      'INSERT INTO servers (name, host_url, api_key, provider_id) VALUES (?, ?, ?, ?)',
      [name, hostUrl, apiKey, user.id]
    );

    const newServer = await db.get(
      'SELECT id, name, host_url, created_at FROM servers WHERE id = ?',
      [result.lastID]
    );

    return NextResponse.json({ server: newServer }, { status: 201 });
  } catch (error) {
    console.error('Create server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 