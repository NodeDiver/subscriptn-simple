import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const { serverId } = await params;
    
    // Get the server information to find the BTCPay host
    const db = await getDatabase();
    const server = await db.get(
      'SELECT host_url FROM servers WHERE id = ?',
      [serverId]
    );
    
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const { BTCPAY_API_KEY } = process.env;
    if (!BTCPAY_API_KEY) {
      return NextResponse.json(
        { error: "BTCPAY_API_KEY must be set" },
        { status: 500 }
      );
    }

    // Fetch stores from the BTCPay server
    const url = `${server.host_url.replace(/\/+$/, "")}/api/v1/stores`;
    const resp = await fetch(url, {
      headers: { Authorization: `token ${BTCPAY_API_KEY}` },
    });
    
    if (!resp.ok) {
      return NextResponse.json(
        { error: `BTCPay returned ${resp.status}` },
        { status: 502 }
      );
    }
    
    const storesRaw = await resp.json();
    const stores = (storesRaw as Array<{
      id: string;
      name: string;
      defaultStoreSettings?: { lightningAddress?: string };
    }>).map((s) => ({
      id: s.id,
      name: s.name,
      lightningAddress: s.defaultStoreSettings?.lightningAddress,
    }));

    // Check for existing subscriptions in our database for each store
    const storesWithSubscriptionStatus = await Promise.all(
      stores.map(async (store) => {
        const existingSubscription = await db.get(
          'SELECT id FROM subscriptions WHERE shop_id = ? AND status = ?',
          [store.id, 'active']
        );
        
        return {
          ...store,
          hasActiveSubscription: !!existingSubscription
        };
      })
    );

    return NextResponse.json({ 
      stores: storesWithSubscriptionStatus,
      totalStores: storesWithSubscriptionStatus.length,
      availableStores: storesWithSubscriptionStatus.filter(s => !s.hasActiveSubscription).length
    });
  } catch (e) {
    console.error("fetch stores error", e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
} 