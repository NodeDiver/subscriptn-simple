import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { getUserById } from '@/lib/auth';
import { validateApiRequest, serverValidationSchema, sanitizeString } from '@/lib/validation';

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
    // Get all servers with ownership information
    const servers = await db.all(
      `SELECT 
        s.id, 
        s.name, 
        s.host_url, 
        s.created_at,
        s.provider_id,
        CASE WHEN s.provider_id = ? THEN 1 ELSE 0 END as is_owner
      FROM servers s 
      ORDER BY s.created_at DESC`,
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

    // Validate input
    const validation = await validateApiRequest(request, serverValidationSchema);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, host_url, api_key } = validation.data;
    const sanitizedName = sanitizeString(name as string);
    const sanitizedHostUrl = sanitizeString(host_url as string);
    const sanitizedApiKey = sanitizeString(api_key as string);

    const db = await getDatabase();
    
    // Check if this host_url already exists
    const existingServer = await db.get(
      'SELECT id, provider_id FROM servers WHERE host_url = ?',
      [sanitizedHostUrl]
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
      [sanitizedName, sanitizedHostUrl, sanitizedApiKey, user.id]
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