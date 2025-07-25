"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/contexts/ToastContext';
import LightningSubscription from '@/components/LightningSubscription';
import ToggleSwitch from '@/components/ToggleSwitch';

type Store = { id: string; name: string; lightningAddress?: string };

interface BTCPayServer {
  id: number;
  name: string;
  host_url: string;
  description: string;
  lightning_address: string;
  available_slots: number;
  current_shops: number;
}

export default function AddShop() {
  // BTCPay Server selection (filtered to public servers with 2+ slots)
  const [availableServers, setAvailableServers] = useState<BTCPayServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<BTCPayServer | null>(null);

  // Shop configuration
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedShop, setSelectedShop] = useState("");

  // Shop owner details (right side)
  const [shopOwnerLightningAddress, setShopOwnerLightningAddress] = useState("");
  const [isShopPublic, setIsShopPublic] = useState(true);

  // Subscription form fields
  const [amount, setAmount] = useState(500);
  const [timeframe, setTimeframe] = useState("30d");
  const [comment, setComment] = useState("");

  // Validation and feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // State for the newly created shop ID
  const [createdShopId, setCreatedShopId] = useState<string | null>(null);
  const [showLightningSub, setShowLightningSub] = useState(false);

  // Fetch available BTCPay servers (public with 2+ slots)
  useEffect(() => {
    const fetchAvailableServers = async () => {
      try {
        const response = await fetch('/api/servers/public');
        if (response.ok) {
          const data = await response.json();
          // Filter servers with at least 2 available slots
          const filteredServers = data.servers.filter((server: BTCPayServer) => server.available_slots >= 2);
          setAvailableServers(filteredServers);
          if (filteredServers.length > 0) {
            setSelectedServer(filteredServers[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
        showToast('Failed to fetch available servers', 'error');
      }
    };

    fetchAvailableServers();
  }, [showToast]);

  // Fetch stores when server changes
  useEffect(() => {
    if (!selectedServer) return;
    
    fetch("/api/stores")
      .then((res) => res.json())
      .then(({ stores }: { stores: Store[] }) => {
        setStores(stores);
        if (stores.length > 0) {
          setSelectedShop(stores[0].id);
        }
      })
      .catch(console.error);
  }, [selectedServer]);

  // Update comment whenever shop or server changes
  useEffect(() => {
    const selected = stores.find((s) => s.id === selectedShop);
    const shopName = selected?.name || "";
    if (shopName && selectedServer) {
      setComment(`${shopName} subscription to ${selectedServer.name}`);
    }
  }, [selectedShop, selectedServer, stores]);

  // Handle subscribe button
  const handleSubscribe = async () => {
    setLoading(true);
    setErrors({});

    if (!selectedServer) {
      showToast('Please select a BTCPay server', 'error');
      setLoading(false);
      return;
    }

    if (!shopOwnerLightningAddress) {
      showToast('Please enter your lightning address for refunds', 'error');
      setLoading(false);
      return;
    }

    const selected = stores.find((s) => s.id === selectedShop);
    
    try {
      // First, create the shop in our database
      const shopResponse = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selected?.name || 'My Shop',
          serverId: selectedServer.id.toString(),
          lightningAddress: shopOwnerLightningAddress,
          isPublic: isShopPublic,
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
            {/* Left Column - BTCPay Server Information (Non-customizable) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">BTCPay Server Information</h2>
              
              {/* BTCPay Server Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select BTCPay Server
                </label>
                <select
                  value={selectedServer?.id || ''}
                  onChange={(e) => {
                    const server = availableServers.find(s => s.id.toString() === e.target.value);
                    setSelectedServer(server || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="">Select a server...</option>
                  {availableServers.map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name} ({server.available_slots} slots available)
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Only public servers with 2+ available slots are shown
                </p>
              </div>

              {/* Server Information Display */}
              {selectedServer && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{selectedServer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedServer.host_url}</p>
                  {selectedServer.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedServer.description}</p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Available slots: <span className="font-medium text-green-600 dark:text-green-400">{selectedServer.available_slots}</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Connected shops: <span className="font-medium">{selectedServer.current_shops}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Shop Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Shop
                </label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="">Select a shop...</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Server Owner's Lightning Address (Read-only) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Server Owner's Lightning Address
                </label>
                <input
                  type="text"
                  value={selectedServer?.lightning_address || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Server owner's lightning address"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This is where subscription payments will be sent
                </p>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={loading || !selectedShop || !selectedServer || !shopOwnerLightningAddress}
                className="w-full bg-green-600 dark:bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Shop...' : 'Create Shop & Subscribe'}
              </button>
            </div>

            {/* Right Column - Shop Owner & Subscription Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Shop & Subscription Details</h2>
              
              {/* Shop Owner's Lightning Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Lightning Address *
                </label>
                <input
                  type="text"
                  value={shopOwnerLightningAddress}
                  onChange={(e) => setShopOwnerLightningAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  placeholder="your@lightning.address"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This is where refunds will be sent if needed
                </p>
              </div>

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

              {/* Shop Public/Private Toggle */}
              <div className="mb-6">
                <ToggleSwitch
                  checked={isShopPublic}
                  onChange={setIsShopPublic}
                  label="Public Shop Listing"
                  description="List your shop in the public directory for other users to see"
                  size="md"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div><strong>Amount:</strong> {amount} sats</div>
                  <div><strong>Timeframe:</strong> {timeframe}</div>
                  <div><strong>Comment:</strong> {comment}</div>
                  <div><strong>Shop Visibility:</strong> {isShopPublic ? 'Public' : 'Private'}</div>
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
              recipientAddress={selectedServer?.lightning_address || ''}
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