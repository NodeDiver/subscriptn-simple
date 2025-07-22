"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/contexts/ToastContext';
import LightningSubscription from '@/components/LightningSubscription';

type Store = { id: string; name: string; lightningAddress?: string };

export default function AddShop() {
  // 1) BTCPay Server selector (hardcoded for now)
  const [server, setServer] = useState("btcpay.aceptabitcoin.com");

  // 2) Shop list fetched from your API once a server is selected
  const [stores, setStores] = useState<Store[]>([]);
  const [shop, setShop] = useState("");

  // Validation and feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // 3) Subscription form fields
  const [recipient, setRecipient] = useState("nodii@getalby.com");
  const [amount, setAmount] = useState(500);
  const [timeframe, setTimeframe] = useState("30d");
  const [comment, setComment] = useState("");

  // State for the newly created shop ID
  const [createdShopId, setCreatedShopId] = useState<string | null>(null);
  const [showLightningSub, setShowLightningSub] = useState(false);

  // Fetch stores when server changes
  useEffect(() => {
    if (!server) return;
    fetch("/api/stores")
      .then((res) => res.json())
      .then(({ stores }: { stores: Store[] }) => {
        setStores(stores);
        if (stores.length > 0) {
          setShop(stores[0].id);
        }
      })
      .catch(console.error);
  }, [server]);

  // Update comment whenever shop or server changes
  useEffect(() => {
    const selected = stores.find((s) => s.id === shop);
    const shopName = selected?.name || "";
    if (shopName && server) {
      setComment(
        `Subscription of ${shopName} to BTCPayserver ${server} through SubscriptN`
      );
    }
  }, [shop, server, stores]);

  // Handle subscribe button
  const handleSubscribe = async () => {
    setLoading(true);
    setErrors({});

    const selected = stores.find((s) => s.id === shop);
    const recipientValue = recipient || selected?.lightningAddress || "";
    
    try {
      // First, create the shop in our database
      const shopResponse = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selected?.name || 'My Shop',
          serverId: '1', // For now, hardcoded to first server
          lightningAddress: recipientValue,
        }),
      });

      if (!shopResponse.ok) {
        const data = await shopResponse.json();
        showToast(data.error || 'Failed to create shop', 'error');
        setLoading(false);
        return;
      }

      const shopData = await shopResponse.json();
      const shopId = shopData.shop.id;
      setCreatedShopId(shopId);
      setShowLightningSub(true);
      setLoading(false);
    } catch (error) {
      console.error('Error creating shop:', error);
      showToast('Failed to create shop', 'error');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            href="/shops"
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to My Shops
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Shop</h1>
        </div>

        {/* Form or LightningSubscription */}
        {!showLightningSub ? (
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            {/* 1) BTCPay Server selector */}
            <div>
              <label className="block text-gray-700 mb-1">
                Select BTCPay Server
              </label>
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="btcpay.aceptabitcoin.com">
                  btcpay.aceptabitcoin.com
                </option>
              </select>
            </div>

            {/* 2) Shop selector (tied to selected server) */}
            <div>
              <label className="block text-gray-700 mb-1">
                Select Shop
              </label>
              <select
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3) Recipient Lightning Address */}
            <div>
              <label className="block text-gray-700 mb-1">
                Recipient Lightning Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={`w-full border rounded-lg p-2 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.recipient ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.recipient && (
                <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>
              )}
            </div>

            {/* 4) Amount slider */}
            <div>
              <label className="block text-gray-700 mb-1">
                Amount: {amount} sats/month
              </label>
              <input
                type="range"
                min={500}
                max={21000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg"
              />
              {amount === 500 && (
                <p className="mt-1 text-sm text-gray-500">
                  *Minimum recommended subscription amount.
                </p>
              )}
            </div>

            {/* 5) Timeframe buttons */}
            <div>
              <label className="block text-gray-700 mb-1">
                Timeframe
              </label>
              <div className="flex gap-2">
                {[
                  { label: "1 Week", value: "weekly" },
                  { label: "1 Month", value: "monthly" },
                  // Optionally, you can add quarterly if you update your DB schema
                  // { label: "3 Months", value: "quarterly" },
                  { label: "1 Year", value: "yearly" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      timeframe === opt.value
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6) Comment input */}
            <div>
              <label className="block text-gray-700 mb-1">
                Comment
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 7) Subscribe button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/shops"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Shop...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        ) : (
          createdShopId && (
            <LightningSubscription
              shopId={createdShopId}
              amountSats={amount}
              interval={timeframe}
              recipientAddress={recipient}
              comment={comment}
              onSuccess={() => {
                showToast('Subscription and payment successful!', 'success');
                window.location.href = `/shops/${createdShopId}`;
              }}
              onCancel={() => {
                setShowLightningSub(false);
                setCreatedShopId(null);
              }}
            />
          )
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
} 