"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onConnected, 
  onDisconnected, 
  onConnecting, 
  launchModal, 
  closeModal, 
  disconnect as bcDisconnect,
  init as bcInit
} from '@getalby/bitcoin-connect';
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
  info: { provider?: unknown } | null;
  isWebLNAvailable: boolean;
}

const BitcoinConnectContext = createContext<BitcoinConnectContextType | undefined>(undefined);

export function BitcoinConnectProvider({ children }: { children: React.ReactNode }) {
  const [isConnectedState, setIsConnectedState] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [info, setInfo] = useState<{ provider?: unknown } | null>(null);
  const [isWebLNAvailable, setIsWebLNAvailable] = useState(false);

  useEffect(() => {
    // Initialize Bitcoin Connect
    bcInit({
      appName: 'SubscriptN',
      appIcon: 'https://your-app-icon.com/icon.png', // Optional
    });

    // Check initial connection state - start as disconnected, let events update it
    setIsConnectedState(false);
    setIsWebLNAvailable(typeof window !== 'undefined' && !!window.webln);

    // Set up event listeners
    const unsubscribeConnected = onConnected((provider) => {
      console.log('Bitcoin Connect: Connected', provider);
      setInfo({ provider });
      setIsConnectedState(true);
      setConnecting(false);
      setError(undefined);
      setModalOpen(false);
      lightningService.setConnectedWallet({ provider });
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    });

    const unsubscribeConnecting = onConnecting(() => {
      console.log('Bitcoin Connect: Connecting...');
      setConnecting(true);
      setError(undefined);
    });

    const unsubscribeDisconnected = onDisconnected(() => {
      console.log('Bitcoin Connect: Disconnected');
      setIsConnectedState(false);
      setInfo(null);
      setError(undefined);
      setConnecting(false);
      lightningService.clearConnectedWallet();
      setIsWebLNAvailable(lightningService.isWebLNAvailable());
    });

    return () => {
      unsubscribeConnected();
      unsubscribeConnecting();
      unsubscribeDisconnected();
    };
  }, []);

  const connect = () => {
    setConnecting(true);
    setError(undefined);
    launchModal();
    setModalOpen(true);
    console.log('Bitcoin Connect: Opening connection modal...');
  };

  const disconnect = () => {
    bcDisconnect();
    setIsConnectedState(false);
    setInfo(null);
    setError(undefined);
    lightningService.clearConnectedWallet();
    console.log('Bitcoin Connect: Disconnected wallet');
  };

  const openModal = () => {
    launchModal();
    setModalOpen(true);
  };

  const closeModalHandler = () => {
    closeModal();
    setModalOpen(false);
    setConnecting(false);
    setError(undefined);
  };

  // Provide a default context value to prevent errors during SSR
  const contextValue: BitcoinConnectContextType = {
    isConnected: isConnectedState,
    connecting,
    connect,
    disconnect,
    openModal,
    closeModal: closeModalHandler,
    modalOpen,
    error,
    info,
    isWebLNAvailable,
  };

  return (
    <BitcoinConnectContext.Provider value={contextValue}>
      {children}
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

// Export the handlers so they can be used by ConnectWalletButton
export function useBitcoinConnectHandlers() {
  return {
    onConnect: (info: { provider?: unknown }) => {
      // The onConnected callback will handle the rest
      console.log('Connect handler called with:', info);
    },
    onDisconnect: () => {
      // The onDisconnected callback will handle the rest
      console.log('Disconnect handler called');
    }
  };
} 