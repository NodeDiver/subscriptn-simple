# Private Server Invitations

## Overview

This feature enables shop owners to connect to private BTCPay servers using unique invitation links, even when those servers are not listed in the public directory.

## Problem Statement

When a BTCPay server owner sets their server as "private" (not listed in public directory), shop owners currently have no way to discover and connect to these servers. This creates a barrier for private server owners who want to selectively share their infrastructure.

## Solution: Unique Invitation Links

### Core Concept
- Each private server gets a unique, auto-generated invitation ID
- Server owners can share this invitation link with specific shop owners
- Shop owners can use the link to connect to the private server
- The server remains hidden from public listings

## Technical Implementation

### Step 1: Database Schema Extension

**File:** `src/lib/database.ts`

Add new column to the `servers` table:
```sql
ALTER TABLE servers ADD COLUMN invite_id TEXT UNIQUE;
```

**Migration:**
```sql
-- Add new column to servers table if it doesn't exist (migration)
ALTER TABLE servers ADD COLUMN invite_id TEXT UNIQUE;
```

### Step 2: Server Model Updates

**File:** `src/lib/validation.ts`

Add validation for invite_id:
```typescript
export const serverValidationSchema = {
  // ... existing fields ...
  invite_id: {
    required: false,
    type: 'string' as const,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_-]+$/, // URL-safe characters only
  }
};
```

### Step 3: API Route Updates

**File:** `src/app/api/servers/route.ts`

#### POST Method Updates:
```typescript
import { nanoid } from 'nanoid';

// In the POST method, after validation:
const inviteId = nanoid(16); // Generate 16-character unique ID

// Update the database insert:
const result = await db.run(
  'INSERT INTO servers (name, host_url, api_key, provider_id, description, is_public, slots_available, lightning_address, invite_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [sanitizedName, sanitizedHostUrl, sanitizedApiKey, user.id, sanitizedDescription, isPublic, slotsAvailable, sanitizedLightningAddress, inviteId]
);
```

#### GET Method Updates:
```typescript
// Include invite_id in the SELECT statement
const servers = await db.all(
  `SELECT 
    s.id, 
    s.name, 
    s.host_url, 
    s.created_at,
    s.provider_id,
    s.description,
    s.is_public,
    s.slots_available,
    s.lightning_address,
    s.invite_id,
    CASE WHEN s.provider_id = ? THEN 1 ELSE 0 END as is_owner
  FROM servers s 
  ORDER BY s.created_at DESC`,
  [user.id]
);
```

### Step 4: New API Route for Invitation Lookup

**File:** `src/app/api/servers/invite/[inviteId]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  try {
    const { inviteId } = params;
    
    if (!inviteId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Find server by invite ID
    const server = await db.get(
      `SELECT 
        id, 
        name, 
        host_url, 
        description,
        is_public,
        slots_available,
        lightning_address,
        created_at
      FROM servers 
      WHERE invite_id = ? AND is_public = 0`,
      [inviteId]
    );

    if (!server) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    return NextResponse.json({ server });
  } catch (error) {
    console.error('Get server by invite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 5: Invitation Join Page

**File:** `src/app/join-server/[inviteId]/page.tsx`

```typescript
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

interface Server {
  id: number;
  name: string;
  host_url: string;
  description?: string;
  slots_available: number;
  lightning_address: string;
}

export default function JoinServer({ params }: { params: { inviteId: string } }) {
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const response = await fetch(`/api/servers/invite/${params.inviteId}`);
        if (response.ok) {
          const data = await response.json();
          setServer(data.server);
        } else {
          setError('Invalid or expired invitation link');
        }
      } catch (error) {
        setError('Failed to load server information');
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, [params.inviteId]);

  const handleJoin = async () => {
    if (!server) return;
    
    setJoining(true);
    try {
      // Here you would implement the logic to associate the shop with the server
      // This might involve creating a shop or updating an existing shop's server_id
      
      showToast('Successfully connected to server!', 'success');
      router.push('/shops');
    } catch (error) {
      showToast('Failed to connect to server', 'error');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This invitation link is no longer valid.'}
          </p>
          <Link
            href="/shops"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join Private Server
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You've been invited to connect to a private BTCPay server
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {server.name}
              </h2>
              {server.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {server.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Server URL
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{server.host_url}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Slots
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{server.slots_available}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {joining ? 'Connecting...' : 'Connect to Server'}
            </button>
            <Link
              href="/shops"
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Update Server Detail/Edit Pages

**File:** `src/app/infrastructure/[serverId]/page.tsx`

Add invitation link display for private servers:

```typescript
// In the server detail component, add this section for private servers:
{!server.is_public && (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
      Private Server Invitation Link
    </h3>
    <p className="text-yellow-700 dark:text-yellow-300 mb-3">
      Share this link with shop owners you want to invite to your server:
    </p>
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={`${window.location.origin}/join-server/${server.invite_id}`}
        readOnly
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
      />
      <button
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/join-server/${server.invite_id}`);
          showToast('Invitation link copied to clipboard!', 'success');
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        Copy
      </button>
    </div>
  </div>
)}
```

### Step 7: Update Add/Edit Server Form

**File:** `src/app/infrastructure/add-server/page.tsx`

Update the public listing description:

```typescript
// Replace the existing description text:
<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
  Public servers will be visible to shop owners looking for BTCPay servers
</p>

// With:
<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
  {isPublic 
    ? 'Public servers will be visible to shop owners looking for BTCPay servers'
    : 'Private servers remain hidden from the public list. To connect, shop owners must use the server\'s invite link.'
  }
</p>
```

## Security Considerations

1. **Invitation ID Generation**: Use cryptographically secure random generation (nanoid)
2. **Access Control**: Only private servers should expose invitation IDs
3. **Rate Limiting**: Implement rate limiting on invitation lookup endpoints
4. **Expiration**: Consider adding expiration dates to invitations
5. **Audit Logging**: Log invitation usage for security monitoring

## Future Enhancements

1. **QR Code Generation**: Add QR codes for easy mobile sharing
2. **Invitation Expiration**: Add expiration dates to invitations
3. **Invitation Limits**: Limit number of shops that can use a single invitation
4. **Invitation Management**: Allow server owners to revoke/regenerate invitations
5. **Analytics**: Track invitation usage and success rates

## Dependencies

- `nanoid`: For generating unique invitation IDs
- `qrcode`: For QR code generation (optional enhancement)

## Testing Checklist

- [ ] Generate unique invitation IDs for new servers
- [ ] Private servers show invitation links
- [ ] Public servers don't expose invitation IDs
- [ ] Invalid invitation IDs return 404
- [ ] Join page displays server information correctly
- [ ] Copy to clipboard functionality works
- [ ] Proper error handling for expired/invalid invitations
- [ ] Mobile responsiveness of join page
- [ ] Security: invitation IDs are URL-safe and unique

## Implementation Priority

**Phase 1 (MVP):**
- Basic invitation ID generation
- Join page with server information
- Copy to clipboard functionality

**Phase 2 (Enhancements):**
- QR code generation
- Invitation expiration
- Analytics and monitoring

**Phase 3 (Advanced):**
- Invitation management dashboard
- Bulk invitation generation
- Advanced security features 