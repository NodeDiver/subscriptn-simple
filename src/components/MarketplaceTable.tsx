"use client";

import React from 'react';
import Link from 'next/link';
import Avatar from './Avatar';

interface ServerData {
  id: number;
  name: string;
  host_url: string;
  description: string | null;
  available_slots: number;
  current_shops: number;
  owner_username: string | null;
  lightning_address: string | null;
  created_at: string;
}

interface ShopData {
  id: number;
  name: string;
  description: string | null;
  lightning_address: string | null;
  subscription_status: string;
  created_at: string;
  is_public: boolean;
  server_linked: boolean;
  server_name: string | null;
  owner_username: string | null;
}

interface MarketplaceTableProps {
  data: ServerData[] | ShopData[];
  type: 'servers' | 'shops';
  isLoading?: boolean;
}

export default function MarketplaceTable({ data, type, isLoading = false }: MarketplaceTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading {type}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              {type === 'servers' ? (
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-1.414 0L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No {type} available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {type === 'servers' 
                ? 'No BTCPay servers are currently available for hosting.' 
                : 'No shops are currently looking for BTCPay Server hosting.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className={`
        px-6 py-4 border-b border-gray-200 dark:border-gray-700
        ${type === 'servers' 
          ? 'bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20' 
          : 'bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-800 dark:to-orange-900/20'
        }
      `}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === 'servers' ? 'Available BTCPay Servers' : 'Shops Seeking Hosting'}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`
              w-2 h-2 rounded-full
              ${type === 'servers' ? 'bg-emerald-500' : 'bg-orange-500'}
            `} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.length} {type}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Table Body */}
      <div className="max-h-96 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                {/* Left Side - Info */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Avatar 
                    name={item.name} 
                    type={type === 'servers' ? 'server' : 'shop'} 
                    size="md" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      {type === 'shops' && !(item as ShopData).server_linked && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                          Seeking Host
                        </span>
                      )}
                    </div>
                    
                    {type === 'servers' ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {(item as ServerData).host_url}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Owner: {(item as ServerData).owner_username}
                        </p>
                        {(item as ServerData).description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                            {(item as ServerData).description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Owner: {(item as ShopData).owner_username}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Stats & Actions */}
                <div className="flex items-center space-x-4 ml-4">
                  {type === 'servers' ? (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {(item as ServerData).available_slots} slots
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {(item as ServerData).current_shops} connected
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${(item as ShopData).subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        }
                      `}>
                        {(item as ShopData).subscription_status}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${type === 'servers' 
                        ? 'bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md' 
                        : 'bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md'
                      }
                    `}>
                      Contact
                    </button>
                    <Link
                      href={type === 'servers' ? `/infrastructure/${item.id}` : `/shops/${item.id}`}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                        ${type === 'servers' 
                          ? 'bg-gradient-to-r from-slate-600 to-emerald-500 hover:from-slate-700 hover:to-emerald-600 text-white shadow-sm hover:shadow-md' 
                          : 'bg-gradient-to-r from-slate-600 to-orange-500 hover:from-slate-700 hover:to-orange-600 text-white shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
