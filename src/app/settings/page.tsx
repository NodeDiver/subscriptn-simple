"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import ToggleSwitch from '@/components/ToggleSwitch';

interface Shop {
  id: number;
  name: string;
  lightning_address: string;
  server_id: number;
  subscription_status: string;
  server_name?: string;
}

interface Server {
  id: number;
  name: string;
  host_url: string;
  status?: 'online' | 'offline';
}

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [userShops, setUserShops] = useState<Shop[]>([]);
  const [userServers, setUserServers] = useState<Server[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingServers, setLoadingServers] = useState(true);
  
  // Toggle switch states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lightningAlerts, setLightningAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserShops();
      fetchUserServers();
    }
  }, [user]);

  const fetchUserShops = async () => {
    try {
      const response = await fetch('/api/shops');
      if (response.ok) {
        const data = await response.json();
        setUserShops(data.shops || []);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      setUserShops([]);
    } finally {
      setLoadingShops(false);
    }
  };

  const fetchUserServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (response.ok) {
        const data = await response.json();
        setUserServers(data.servers || []);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      setUserServers([]);
    } finally {
      setLoadingServers(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSave = async (section: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message (you can add toast here)
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link 
                href="/dashboard"
                className="text-[#1E3A8A] dark:text-[#3B82F6] hover:text-[#0F766E] dark:hover:text-[#14B8A6] mr-4"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Settings Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', name: 'Profile', icon: '👤' },
                  { id: 'account', name: 'Account', icon: '🔐' },
                  { id: 'wallet', name: 'Wallet', icon: '💰' },
                  { id: 'servers', name: 'BTCPay Servers', icon: '⚡' },
                  { id: 'shops', name: 'Shops', icon: '🏪' },
                  { id: 'preferences', name: 'Preferences', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#2D5A3D] dark:border-[#10B981] text-[#2D5A3D] dark:text-[#10B981]'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.username || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="user@example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Lightning Address
                        </label>
                        <input
                          type="text"
                          defaultValue="user@getalby.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent">
                          <option>UTC</option>
                          <option>America/New_York</option>
                          <option>Europe/London</option>
                          <option>Asia/Tokyo</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleSave('profile')}
                        disabled={isLoading}
                        className="bg-[#2D5A3D] dark:bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A] dark:hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2D5A3D] dark:focus:ring-[#10B981] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleSave('password')}
                        disabled={isLoading}
                        className="bg-[#2D5A3D] dark:bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A] dark:hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h4>
                    <div className="space-y-6">
                      <ToggleSwitch
                        checked={true}
                        onChange={() => {}}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                        size="md"
                      />
                      
                      <ToggleSwitch
                        checked={false}
                        onChange={() => {}}
                        label="Session Management"
                        description="Allow multiple active sessions across devices"
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bitcoin Wallet</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Connect Your Wallet</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Connect your lightning wallet to manage subscriptions and payments
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Link
                            href="/nwc-management"
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            Setup NWC Connection
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-[#F59E0B]/10 dark:bg-[#FBBF24]/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-[#F59E0B] dark:text-[#FBBF24] text-lg">⚡</span>
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Lightning Balance</h5>
                          </div>
                          <p className="text-2xl font-bold text-[#2D5A3D] dark:text-[#10B981]">0 sats</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available for payments</p>
                        </div>

                        <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-[#3B82F6]/10 dark:bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-[#3B82F6] dark:text-[#60A5FA] text-lg">📊</span>
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Payment History</h5>
                          </div>
                          <p className="text-2xl font-bold text-[#1E3A8A] dark:text-[#3B82F6]">0</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total transactions</p>
                        </div>
                      </div>

                      <div className="mt-8 space-y-6">
                        <h5 className="font-medium text-gray-900 dark:text-white">Wallet Settings</h5>
                        <div className="space-y-4">
                          <ToggleSwitch
                            checked={true}
                            onChange={() => {}}
                            label="Auto-payments"
                            description="Automatically process recurring payments"
                            size="sm"
                          />
                          
                          <ToggleSwitch
                            checked={true}
                            onChange={() => {}}
                            label="Invoice generation"
                            description="Generate Lightning invoices automatically"
                            size="sm"
                          />
                          
                          <ToggleSwitch
                            checked={true}
                            onChange={() => {}}
                            label="Payment tracking"
                            description="Track all payment history and status"
                            size="sm"
                          />
                          
                          <ToggleSwitch
                            checked={false}
                            onChange={() => {}}
                            label="Advanced analytics"
                            description="Enable detailed payment analytics and reports"
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className="mt-8 p-4 bg-[#FEF3C7]/50 dark:bg-[#92400E]/20 border border-[#F59E0B]/20 dark:border-[#FBBF24]/20 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <span className="text-[#F59E0B] dark:text-[#FBBF24] text-lg">💡</span>
                          </div>
                          <div className="ml-3">
                            <h6 className="text-sm font-medium text-[#92400E] dark:text-[#FBBF24]">Coming Soon</h6>
                            <p className="text-sm text-[#92400E]/80 dark:text-[#FBBF24]/80 mt-1">
                              Advanced wallet features including multi-wallet support, payment scheduling, and detailed analytics will be available in future updates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'servers' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">BTCPay Servers</h3>
                    <Link
                      href="/infrastructure/add-server"
                      className="bg-[#2D5A3D] dark:bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A] dark:hover:bg-[#3B82F6] transition-colors"
                    >
                      + Add New Server
                    </Link>
                  </div>
                  
                  {loadingServers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A3D] dark:border-[#10B981] mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Loading servers...</p>
                    </div>
                  ) : (userServers || []).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">No BTCPay servers found.</p>
                      <Link
                        href="/infrastructure/add-server"
                        className="inline-block mt-2 text-[#1E3A8A] dark:text-[#3B82F6] hover:text-[#0F766E] dark:hover:text-[#14B8A6]"
                      >
                        Add your first server →
                      </Link>
                    </div>
                  ) : (
                    (userServers || []).map((server) => (
                      <div key={server.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{server.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{server.host_url}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              server.status === 'online' 
                                ? 'bg-[#10B981]/10 dark:bg-[#34D399]/20 text-[#10B981] dark:text-[#34D399]'
                                : 'bg-[#EF4444]/10 dark:bg-[#F87171]/20 text-[#EF4444] dark:text-[#F87171]'
                            }`}>
                              {server.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                            <Link
                              href={`/infrastructure/${server.id}`}
                              className="text-[#1E3A8A] dark:text-[#3B82F6] hover:text-[#0F766E] dark:hover:text-[#14B8A6] text-sm font-medium"
                            >
                              Manage →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'shops' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Shops</h3>
                    <Link
                      href="/shops/add-shop"
                      className="bg-[#2D5A3D] dark:bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A] dark:hover:bg-[#3B82F6] transition-colors"
                    >
                      + Add New Shop
                    </Link>
                  </div>
                  
                  {loadingShops ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A3D] dark:border-[#10B981] mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Loading shops...</p>
                    </div>
                  ) : (userShops || []).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">No shops found.</p>
                      <Link
                        href="/shops/add-shop"
                        className="inline-block mt-2 text-[#1E3A8A] dark:text-[#3B82F6] hover:text-[#0F766E] dark:hover:text-[#14B8A6]"
                      >
                        Add your first shop →
                      </Link>
                    </div>
                  ) : (
                    (userShops || []).map((shop) => (
                      <div key={shop.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{shop.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Lightning: {shop.lightning_address}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Server ID: {shop.server_id}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              shop.subscription_status === 'active' 
                                ? 'bg-[#10B981]/10 dark:bg-[#34D399]/20 text-[#10B981] dark:text-[#34D399]'
                                : shop.subscription_status === 'pending'
                                ? 'bg-[#F59E0B]/10 dark:bg-[#FBBF24]/20 text-[#F59E0B] dark:text-[#FBBF24]'
                                : 'bg-[#EF4444]/10 dark:bg-[#F87171]/20 text-[#EF4444] dark:text-[#F87171]'
                            }`}>
                              {shop.subscription_status.charAt(0).toUpperCase() + shop.subscription_status.slice(1)}
                            </span>
                            <Link
                              href={`/shops/${shop.id}`}
                              className="text-[#1E3A8A] dark:text-[#3B82F6] hover:text-[#0F766E] dark:hover:text-[#14B8A6] text-sm font-medium"
                            >
                              Manage →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Preferences</h3>
                    <div className="space-y-6">
                      <ToggleSwitch
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                        label="Email Notifications"
                        description="Receive email updates about your subscriptions"
                        size="md"
                      />
                      
                      <ToggleSwitch
                        checked={lightningAlerts}
                        onChange={setLightningAlerts}
                        label="Lightning Network Alerts"
                        description="Get notified about payment status changes"
                        size="md"
                      />

                      <ToggleSwitch
                        checked={autoRefresh}
                        onChange={setAutoRefresh}
                        label="Auto-refresh Dashboard"
                        description="Automatically refresh dashboard data every 30 seconds"
                        size="md"
                      />
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleSave('preferences')}
                        disabled={isLoading}
                        className="bg-[#2D5A3D] dark:bg-[#10B981] text-white px-4 py-2 rounded-md hover:bg-[#1E3A8A] dark:hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 