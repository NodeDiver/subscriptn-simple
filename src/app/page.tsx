"use client";
import { useState, useEffect } from "react";

type Store = { id: string; name: string; lightningAddress?: string };

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [shop, setShop] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(100);
  const [timeframe, setTimeframe] = useState("30d");
  const [comment, setComment] = useState("");

  // 1) Fetch stores on mount
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

  // 2) Handle subscribe click
  const handleSubscribe = () => {
    const selected = stores.find((s) => s.id === shop);
    const recipientValue = recipient || selected?.lightningAddress || "";
    const shopName = selected?.name || "";
    const commentValue = comment || `Subscription to ${shopName}`;

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
          Automate monthly subscriptions for your BTCPay shops using Nostr
          Wallet Connect.
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
              placeholder="Leave empty to use store default"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Amount (sats/month)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Timeframe
            </label>
            <input
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Comment (optional)
            </label>
            <input
              type="text"
              placeholder="E.g. Subscription to Shop X"
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
