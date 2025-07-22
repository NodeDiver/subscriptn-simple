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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link 
              href="/shops"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Shop</h1>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Shop Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Shop Configuration</h2>
              
              {/* BTCPay Server Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  BTCPay Server
                </label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="btcpay.aceptabitcoin.com">btcpay.aceptabitcoin.com</option>
                </select>
              </div>

              {/* Shop Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Shop
                </label>
                <select
                  value={shop}
                  onChange={(e) => setShop(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lightning Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lightning Address (Optional)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  placeholder="your@lightning.address"
                />
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={loading || !shop}
                className="w-full bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Shop...' : 'Create Shop & Subscribe'}
              </button>
            </div>

            {/* Right Column - Subscription Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Subscription Details</h2>
              
              {/* Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (sats)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  min="1"
                />
              </div>

              {/* Timeframe */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="30d">30 days</option>
                  <option value="7d">7 days</option>
                  <option value="1d">1 day</option>
                </select>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Subscription comment..."
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div><strong>Amount:</strong> {amount} sats</div>
                  <div><strong>Timeframe:</strong> {timeframe}</div>
                  <div><strong>Comment:</strong> {comment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lightning Subscription Modal */}
          {showLightningSub && createdShopId && (
            <LightningSubscription
              shopId={createdShopId}
              amountSats={amount}
              interval={timeframe}
              recipientAddress={recipient}
              comment={comment}
              onSuccess={() => {
                setShowLightningSub(false);
                setCreatedShopId(null);
              }}
              onCancel={() => {
                setShowLightningSub(false);
                setCreatedShopId(null);
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 