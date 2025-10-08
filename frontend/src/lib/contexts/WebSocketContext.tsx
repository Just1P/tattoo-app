"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
  on: () => {},
  off: () => {},
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      console.log("🔌 WebSocket: Pas d'utilisateur, pas de connexion");
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("🔌 WebSocket: Pas de token, pas de connexion");
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    console.log("🔌 WebSocket: Tentative de connexion à", wsUrl);
    console.log("🔌 WebSocket: Token présent:", token.substring(0, 20) + "...");

    const newSocket = io(wsUrl, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ WebSocket connecté avec succès! ID:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ WebSocket déconnecté:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion WebSocket:", error.message);
      console.error("❌ Détails:", error);
      setIsConnected(false);
    });

    newSocket.onAny((eventName, ...args) => {
      console.log("🔔 Événement WebSocket reçu:", eventName, args);
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 WebSocket: Nettoyage de la connexion");
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socket && isConnected) {
        socket.emit(event, data);
      }
    },
    [socket, isConnected]
  );

  const on = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback?: (data: unknown) => void) => {
      if (socket) {
        if (callback) {
          socket.off(event, callback);
        } else {
          socket.off(event);
        }
      }
    },
    [socket]
  );

  const value = {
    socket,
    isConnected,
    emit,
    on,
    off,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
