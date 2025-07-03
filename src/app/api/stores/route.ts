import { NextResponse } from "next/server";

export async function GET() {
  const { BTCPAY_HOST, BTCPAY_API_KEY } = process.env;
  if (!BTCPAY_HOST || !BTCPAY_API_KEY) {
    return NextResponse.json(
      { error: "BTCPAY_HOST and BTCPAY_API_KEY must be set" },
      { status: 500 }
    );
  }

  const url = `${BTCPAY_HOST.replace(/\/+$/, "")}/api/v1/stores`;
  try {
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
    const stores = (storesRaw as any[]).map((s) => ({
      id: s.id,
      name: s.name,
      lightningAddress: s.defaultStoreSettings?.lightningAddress,
    }));
    return NextResponse.json({ stores });
  } catch (e) {
    console.error("fetch stores error", e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
} 