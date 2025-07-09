"use client";
import { useEffect, useRef, useCallback } from "react";

// Ambient module declaration for custom element 'bc-button'
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'bc-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ConnectWalletButtonProps {
  onConnect?: (info: any) => void;
  onDisconnect?: () => void;
}

export default function ConnectWalletButton({ onConnect, onDisconnect }: ConnectWalletButtonProps) {
  const buttonRef = useRef<any>(null);
  const lastElRef = useRef<any>(null);

  // Callback ref to always attach listeners to the latest element
  const setButtonRef = useCallback((node: any) => {
    if (lastElRef.current && lastElRef.current !== node) {
      // Clean up listeners from previous node
      lastElRef.current.removeEventListener('bc:connected', lastElRef.current._handleConnected);
      lastElRef.current.removeEventListener('bc:disconnected', lastElRef.current._handleDisconnected);
    }
    if (node) {
      // Attach listeners to new node
      const handleConnected = (e: any) => {
        console.log('bc:connected event fired from bc-button', e);
        if (onConnect) onConnect(e.detail);
      };
      const handleDisconnected = () => {
        console.log('bc:disconnected event fired from bc-button');
        if (onDisconnect) onDisconnect();
      };
      node.addEventListener('bc:connected', handleConnected);
      node.addEventListener('bc:disconnected', handleDisconnected);
      // Store handlers for cleanup
      node._handleConnected = handleConnected;
      node._handleDisconnected = handleDisconnected;
    }
    buttonRef.current = node;
    lastElRef.current = node;
  }, [onConnect, onDisconnect]);

  useEffect(() => {
    import("@getalby/bitcoin-connect");
  }, []);

  return <bc-button ref={setButtonRef}></bc-button>;
} 