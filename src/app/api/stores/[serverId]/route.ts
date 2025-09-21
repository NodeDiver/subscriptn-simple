import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const { serverId } = await params;
    
    // Get the server information to find the BTCPay host and API key using Prisma
    const server = await prisma.server.findUnique({
      where: { id: parseInt(serverId) },
      select: { hostUrl: true, apiKey: true }
    });
    
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Use the server's stored API key instead of global environment variable
    if (!server.apiKey) {
      return NextResponse.json(
        { error: "Server API key not configured" },
        { status: 500 }
      );
    }

    // Fetch stores from the BTCPay server
    const url = `${server.hostUrl.replace(/\/+$/, "")}/api/v1/stores`;
    const resp = await fetch(url, {
      headers: { Authorization: `token ${server.apiKey}` },
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
        // Find the local shop that corresponds to this BTCPay store
        const localShop = await prisma.shop.findFirst({
          where: {
            serverId: parseInt(serverId),
            // We need to match by some identifier - for now we'll check if there's a shop with this name
            // In a real implementation, you'd want to store the BTCPay store ID in the shop record
            name: store.name
          }
        });
        
        const existingSubscription = localShop ? await prisma.subscription.findFirst({
          where: {
            shopId: localShop.id,
            status: 'active'
          }
        }) : null;
        
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