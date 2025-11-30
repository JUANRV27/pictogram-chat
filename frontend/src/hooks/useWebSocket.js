import { useState, useEffect, useRef } from "react";

export default function useWebSocket(roomId, token, onMessage) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!roomId || !token) return;

    // Build WebSocket URL from API URL (convert http/https to ws/wss)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const WS_URL = API_URL.replace(/^http/, 'ws');
    
    const ws = new WebSocket(`${WS_URL}/chat/ws/${roomId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessage) {
        onMessage(data);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Connection error");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, token, onMessage]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { isConnected, error, sendMessage };
}
