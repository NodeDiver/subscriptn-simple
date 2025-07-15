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
    if (!user) {
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
    if (!user) {
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
    
    // Check if this host_url already exists
    const existingServer = await db.get(
      'SELECT id, provider_id FROM servers WHERE host_url = ?',
      [hostUrl]
    );

    if (existingServer) {
      // Check if the current user already owns this server
      if (existingServer.provider_id === user.id) {
        return NextResponse.json(
          { error: 'You already own a server with this host URL' },
          { status: 400 }
        );
      } else {
        // Another user owns this server
        return NextResponse.json(
          { error: 'This server is already owned by another user' },
          { status: 409 }
        );
      }
    }

    // No existing server with this host_url, create new one
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

    const db = await getDatabase();
    
    // Check if the server exists and is owned by the current user
    const server = await db.get(
      'SELECT id, name FROM servers WHERE id = ? AND provider_id = ?',
      [serverId, user.id]
    );

    if (!server) {
      return NextResponse.json({ error: 'Server not found or not owned by you' }, { status: 404 });
    }

    // Delete the server
    await db.run('DELETE FROM servers WHERE id = ?', [serverId]);

    return NextResponse.json({ message: 'Server removed successfully' });
  } catch (error) {
    console.error('Delete server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 