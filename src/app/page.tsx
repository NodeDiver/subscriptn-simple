"use client";
import { useState, useEffect } from "react";

type Store = { id: string; name: string; lightningAddress?: string };
const BTCPAY_SERVER = "btcpay.aceptabitcoin.com";

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [shop, setShop] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("nodii@getalby.com");
  const [amount, setAmount] = useState<number>(500);
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [comment, setComment] = useState<string>("");

  const timeframeOptions = [
    { value: '7d', label: '1 Week' },
    { value: '30d', label: '1 Month' },
    { value: '90d', label: '3 Months' },
    { value: '365d', label: '1 Year' },
  ];

  // Fetch stores on mount
  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then(({ stores }: { stores: Store[] }) => {
        setStores(stores);
        if (stores.length > 0) {
          setShop(stores[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Update comment default when shop changes
  useEffect(() => {
    const selected = stores.find((s) => s.id === shop);
    if (selected) {
      setComment(
        `Subscription from ${selected.name} shop owner to ${BTCPAY_SERVER} through SubscriptN`
      );
    }
  }, [shop, stores]);

  const handleSubscribe = () => {
    const selected = stores.find((s) => s.id === shop);
    const recipientValue = recipient || selected?.lightningAddress || "";
    const shopName = selected?.name || "";
    const commentValue = comment || 
      `Subscription from ${shopName} shopowner to ${BTCPAY_SERVER} through SubscriptN`;

    const params = new URLSearchParams({
      amount: amount.toString(),
      recipient: recipientValue,
      timeframe,
      comment: commentValue,
      returnUrl: window.location.origin + "/thanks",
    });

    window.location.href = `https://zapplanner.albylabs.com/confirm?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center">
          SubscriptN for BTCPay
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Automate subscriptions for your BTCPay shops via Nostr Wallet Connect.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {/* Shop selector */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Select Shop
            </label>
            <select
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a shop
              </option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lightning address override */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Recipient Lightning Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount slider */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Amount: {amount} sats/month
            </label>
            <input
              type="range"
              min="500"
              max="21000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            {amount === 500 && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Minimum recommended subscription amount.
              </p>
            )}
          </div>

          {/* Timeframe buttons */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Timeframe
            </label>
            <div className="flex gap-2">
              {timeframeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeframe(value)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    timeframe === value
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Comment
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 transition-colors"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
