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

  // Auto-close modal when 'bc:connected' event is fired (listen on window)
  useEffect(() => {
    if (!isOpen) return;
    const handleConnected = () => {
      setTimeout(() => {
        onClose();
      }, 2000);
    };
    window.addEventListener('bc:connected', handleConnected);
    return () => {
      window.removeEventListener('bc:connected', handleConnected);
    };
  }, [isOpen, onClose]);

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
      {/* Custom style for <bc-connect> modal background */}
      <style>{`
        bc-connect::part(modal) {
          background: #e5e7eb !important;
          border-radius: 20px !important;
          box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.18) !important;
        }
        bc-connect::part(content) {
          padding: 32px 32px 24px 32px !important;
        }
        bc-connect::part(header) {
          margin-top: 12px !important;
          margin-bottom: 24px !important;
        }
        bc-connect::part(footer) {
          margin-bottom: 12px !important;
          margin-top: 24px !important;
        }
      `}</style>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-0 max-w-md w-full mx-4 pt-8 pb-8 px-8"
      >
        {/* Bitcoin Connect Web Component Modal */}
        <bc-connect ref={bcConnectRef} open="true" app-name="SubscriptN" app-description="Bitcoin Subscription Management Platform" app-icon-url="/file.svg" closable="true" />
      </div>
    </div>
  );
} 