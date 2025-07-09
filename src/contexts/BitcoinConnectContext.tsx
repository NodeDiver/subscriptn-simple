"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import BitcoinConnectModal from '@/components/BitcoinConnectModal';
import { lightningService } from '@/lib/lightning';

interface BitcoinConnectContextType {
  isConnected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
  error: string | undefined;
  info: any;
  isWebLNAvailable: boolean;
}

const BitcoinConnectContext = createContext<BitcoinConnectContextType | undefined>(undefined);

export function BitcoinConnectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<any>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if WebLN is available
    setIsWebLNAvailable(typeof window !== 'undefined' && !!window.webln);

    // Listen for Bitcoin Connect events globally
    function handleBCConnected(e: any) {
      setInfo(e.detail);
      setIsConnected(true);
      setConnecting(false);
      setError(undefined);
      lightningService.setConnectedWallet(e.detail);
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    }
    function handleBCDisconnected() {
      setIsConnected(false);
      setInfo(null);
      setError(undefined);
      lightningService.clearConnectedWallet();
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('bc:connected', handleBCConnected);
      window.addEventListener('bc:disconnected', handleBCDisconnected);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('bc:connected', handleBCConnected);
        window.removeEventListener('bc:disconnected', handleBCDisconnected);
      }
    };
  }, []);

  const connect = () => {
    setConnecting(true);
    setModalOpen(true);
    setError(undefined);
    console.log('Bitcoin Connect: Opening connection modal...');
  };

  const disconnect = () => {
    setIsConnected(false);
    setInfo(null);
    setError(undefined);
    
    // Clear the connected wallet from the Lightning service
    lightningService.clearConnectedWallet();
    
    console.log('Bitcoin Connect: Disconnected wallet');
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setConnecting(false);
    setError(undefined);
  };

  const handleConnect = (info: any) => {
    setInfo(info);
    setIsConnected(true);
    setConnecting(false);
    setError(undefined);
    
    // Set the connected wallet in the Lightning service
    lightningService.setConnectedWallet(info);
    
    // Check WebLN availability after connection
    setIsWebLNAvailable(lightningService.isWebLNAvailable());
    
    // Auto-close modal after 2 seconds
    setTimeout(() => {
      setModalOpen(false);
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    console.error('Bitcoin Connect: Error', errorMessage);
    setError(errorMessage);
    setConnecting(false);
    setIsConnected(false);
  };

  // Provide a default context value to prevent errors during SSR
  const contextValue: BitcoinConnectContextType = {
    isConnected,
    connecting,
    connect,
    disconnect,
    openModal,
    closeModal,
    modalOpen,
    error,
    info,
    isWebLNAvailable,
  };

  return (
    <BitcoinConnectContext.Provider value={contextValue}>
      {children}
      {/* Bitcoin Connect Modal */}
      <BitcoinConnectModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConnect={handleConnect}
        onError={handleError}
      />
    </BitcoinConnectContext.Provider>
  );
}

export function useBitcoinConnectContext() {
  const context = useContext(BitcoinConnectContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      isConnected: false,
      connecting: false,
      connect: () => console.log('Bitcoin Connect not initialized'),
      disconnect: () => console.log('Bitcoin Connect not initialized'),
      openModal: () => console.log('Bitcoin Connect not initialized'),
      closeModal: () => console.log('Bitcoin Connect not initialized'),
      modalOpen: false,
      error: undefined,
      info: null,
      isWebLNAvailable: false,
    };
  }
  return context;
} 

// In the context, export the handlers so they can be used by ConnectWalletButton
export function useBitcoinConnectHandlers() {
  const { setInfo, setIsConnected, setConnecting, setError, setIsWebLNAvailable } = useBitcoinConnectContext() as any;
  return {
    onConnect: (info: any) => {
      setInfo(info);
      setIsConnected(true);
      setConnecting(false);
      setError(undefined);
      lightningService.setConnectedWallet(info);
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    },
    onDisconnect: () => {
      setIsConnected(false);
      setInfo(null);
      setError(undefined);
      lightningService.clearConnectedWallet();
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    }
  };
} 