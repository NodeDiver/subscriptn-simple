"use client";

import React from 'react';

interface MarketplaceSwitchProps {
  isServerView: boolean;
  onToggle: (isServerView: boolean) => void;
}

export default function MarketplaceSwitch({ isServerView, onToggle }: MarketplaceSwitchProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* Switch Container */}
      <div className="relative">
        <button
          onClick={() => onToggle(!isServerView)}
          className={`
            relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${isServerView 
              ? 'bg-gradient-to-r from-slate-600 to-emerald-500 shadow-lg shadow-emerald-500/25' 
              : 'bg-gradient-to-r from-slate-600 to-orange-500 shadow-lg shadow-orange-500/25'
            }
          `}
          role="switch"
          aria-checked={isServerView}
          aria-label={`Switch to ${isServerView ? 'shops' : 'BTCPay servers'} view`}
        >
          {/* Sliding Background */}
          <div
            className={`
              absolute top-1 left-1 h-10 w-10 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out transform
              ${isServerView ? 'translate-x-0' : 'translate-x-12'}
            `}
          />
          
          {/* Icons */}
          <div className="relative flex w-full items-center justify-between px-3">
            {/* BTCPay Server Icon */}
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
              ${isServerView 
                ? 'text-emerald-600 scale-110' 
                : 'text-gray-400 scale-90'
              }
            `}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
                <path d="M7 7h6v2H7V7zm0 4h6v2H7v-2z" />
              </svg>
            </div>
            
            {/* Shop Icon */}
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
              ${!isServerView 
                ? 'text-orange-600 scale-110' 
                : 'text-gray-400 scale-90'
              }
            `}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-1.414 0L3.293 7.293A1 1 0 013 6.586V4z" />
                <path d="M15 8a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Labels */}
      <div className="flex flex-col space-y-1">
        <div className={`
          text-sm font-medium transition-all duration-300
          ${isServerView 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-gray-500 dark:text-gray-400'
          }
        `}>
          BTCPay Servers
        </div>
        <div className={`
          text-sm font-medium transition-all duration-300
          ${!isServerView 
            ? 'text-orange-600 dark:text-orange-400' 
            : 'text-gray-500 dark:text-gray-400'
          }
        `}>
          Shops
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`
          w-2 h-2 rounded-full transition-all duration-300
          ${isServerView 
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' 
            : 'bg-orange-500 shadow-lg shadow-orange-500/50'
          }
        `} />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {isServerView ? 'Infrastructure' : 'Marketplace'}
        </span>
      </div>
    </div>
  );
}
