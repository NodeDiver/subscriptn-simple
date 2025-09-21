"use client";

import React from 'react';
import { BoltIcon } from '@heroicons/react/24/outline';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Specialized loading components
export function LightningLoadingSpinner({ text = "Processing Lightning payment..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 dark:border-neutral-700 border-t-primary-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BoltIcon className="w-6 h-6 text-primary-500" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{text}</p>
      <div className="mt-2 flex space-x-1">
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}

export function WalletLoadingSpinner({ text = "Connecting wallet..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">🔗</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  );
} 