import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const { serverId } = await params;
    
    // Get the server information to find the BTCPay host using Prisma
    const server = await prisma.server.findUnique({
      where: { id: parseInt(serverId) },
      select: { hostUrl: true }
    });
    
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
    const url = `${server.hostUrl.replace(/\/+$/, "")}/api/v1/stores`;
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

    // Check for existing subscriptions in our database for each store using Prisma
    const storesWithSubscriptionStatus = await Promise.all(
      stores.map(async (store) => {
        const existingSubscription = await prisma.subscription.findFirst({
          where: {
            shopId: parseInt(store.id),
            status: 'active'
          }
        });
        
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