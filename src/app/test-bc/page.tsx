"use client";
import { useEffect } from "react";

export default function TestBC() {
  useEffect(() => {
    import("@getalby/bitcoin-connect");
  }, []);
  return (
    <div style={{ margin: 40 }}>
      <bc-button></bc-button>
    </div>
  );
} 