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
  onConnect?: (info: { provider?: unknown }) => void;
  onDisconnect?: () => void;
}

export default function ConnectWalletButton({ onConnect, onDisconnect }: ConnectWalletButtonProps) {
  const buttonRef = useRef<HTMLElement | null>(null);
  const lastElRef = useRef<HTMLElement | null>(null);

  // Callback ref to always attach listeners to the latest element
  const setButtonRef = useCallback((node: HTMLElement | null) => {
    if (lastElRef.current && lastElRef.current !== node) {
      // Clean up listeners from previous node
      const prevNode = lastElRef.current as HTMLElement & { _handleConnected?: EventListener; _handleDisconnected?: EventListener };
      if (prevNode._handleConnected) {
        prevNode.removeEventListener('bc:connected', prevNode._handleConnected);
      }
      if (prevNode._handleDisconnected) {
        prevNode.removeEventListener('bc:disconnected', prevNode._handleDisconnected);
      }
    }
    if (node) {
      // Attach listeners to new node
      const handleConnected = (e: Event) => {
        console.log('bc:connected event fired from bc-button', e);
        if (onConnect) onConnect((e as CustomEvent).detail);
      };
      const handleDisconnected = () => {
        console.log('bc:disconnected event fired from bc-button');
        if (onDisconnect) onDisconnect();
      };
      node.addEventListener('bc:connected', handleConnected);
      node.addEventListener('bc:disconnected', handleDisconnected);
      // Store handlers for cleanup
      (node as HTMLElement & { _handleConnected?: EventListener; _handleDisconnected?: EventListener })._handleConnected = handleConnected;
      (node as HTMLElement & { _handleConnected?: EventListener; _handleDisconnected?: EventListener })._handleDisconnected = handleDisconnected;
    }
    buttonRef.current = node;
    lastElRef.current = node;
  }, [onConnect, onDisconnect]);

  useEffect(() => {
    import("@getalby/bitcoin-connect");
  }, []);

  return <bc-button ref={setButtonRef}></bc-button>;
} 