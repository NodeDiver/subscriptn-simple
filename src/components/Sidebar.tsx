"use client";

import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop - only covers the left side */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 h-full w-80 bg-transparent z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-purple-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Top section matching main top bar height */}
        <div className="h-16 bg-purple-900 border-b border-purple-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">SubscriptN</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="p-6 flex-1">
          {/* Content */}
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <p className="text-lg font-medium">Good things will be placed here</p>
              <p className="text-purple-200 text-sm mt-2">Coming soon...</p>
            </div>
          </div>
        </div>
        {/* Remove theme switch button at the bottom */}
      </div>
    </>
  );
} 