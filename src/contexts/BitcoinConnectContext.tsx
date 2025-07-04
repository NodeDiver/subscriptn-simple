"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import BitcoinConnectModal from '@/components/BitcoinConnectModal';

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
}

const BitcoinConnectContext = createContext<BitcoinConnectContextType | undefined>(undefined);

export function BitcoinConnectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
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

  const handleConnect = (walletInfo: any) => {
    console.log('Bitcoin Connect: Connected successfully', walletInfo);
    setIsConnected(true);
    setInfo(walletInfo);
    setConnecting(false);
    setError(undefined);
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
    };
  }
  return context;
} 