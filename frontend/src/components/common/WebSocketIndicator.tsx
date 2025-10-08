"use client";

import { useWebSocket } from "@/lib/contexts/WebSocketContext";
import { IconPlugConnected, IconPlugConnectedX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function WebSocketIndicator() {
  const { isConnected } = useWebSocket();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [isConnected]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
        isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {isConnected ? (
        <>
          <IconPlugConnected className="h-5 w-5" />
          <span className="text-sm font-medium">WebSocket connecté</span>
        </>
      ) : (
        <>
          <IconPlugConnectedX className="h-5 w-5" />
          <span className="text-sm font-medium">WebSocket déconnecté</span>
        </>
      )}
    </div>
  );
}
