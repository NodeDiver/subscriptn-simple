"use client";

import React, { useEffect, useRef } from 'react';

interface BitcoinConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (info: any) => void;
  onError: (error: string) => void;
}

export default function BitcoinConnectModal({ 
  isOpen, 
  onClose, 
  onConnect, 
  onError 
}: BitcoinConnectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const bcConnectRef = useRef<any>(null);

  // Dynamically import the Bitcoin Connect web component on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@getalby/bitcoin-connect');
    }
  }, []);

  // Listen for connection events
  useEffect(() => {
    const handleConnected = (e: any) => {
      onConnect(e.detail);
      onClose();
    };
    const handleError = (e: any) => {
      onError(e.detail?.message || 'Failed to connect wallet');
    };
    const handleClose = () => {
      onClose();
    };
    const el = bcConnectRef.current;
    if (el && isOpen) {
      el.addEventListener('bc:connected', handleConnected);
      el.addEventListener('bc:error', handleError);
      el.addEventListener('bc:close', handleClose);
    }
    return () => {
      if (el) {
        el.removeEventListener('bc:connected', handleConnected);
        el.removeEventListener('bc:error', handleError);
        el.removeEventListener('bc:close', handleClose);
      }
    };
  }, [isOpen, onConnect, onError, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-0 max-w-md w-full mx-4"
      >
        {/* Bitcoin Connect Web Component Modal */}
        <bc-connect ref={bcConnectRef} open="true" app-name="SubscriptN" app-description="Bitcoin Subscription Management Platform" app-icon-url="/file.svg" closable="true" />
      </div>
    </div>
  );
} 