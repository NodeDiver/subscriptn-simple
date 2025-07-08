"use client";
import { useEffect } from "react";

export default function BitcoinConnectProvider() {
  useEffect(() => {
    import("@getalby/bitcoin-connect");
  }, []);
  return null;
} 