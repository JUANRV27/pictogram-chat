import { useState, useEffect, useCallback } from "react";
import { chatApi } from "../api/chatApi";
import useWebSocket from "../hooks/useWebSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom({ room, currentUser, onLeaveRoom }) {
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const token = localStorage.getItem("token");

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === "message") {
      // Prevent duplicate messages by checking if message ID already exists
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) {
          return prev; // Message already in list, don't add again
        }
        return [...prev, data];
      });
    } else if (data.type === "user_joined") {
      console.log(`${data.username} joined the room`);
    } else if (data.type === "user_left") {
      console.log(`${data.username} left the room`);
    }
  }, []);

  const { isConnected, error, sendMessage } = useWebSocket(
    room.id,
    token,
    handleWebSocketMessage
  );

  // Load message history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatApi.getMessages(room.id);
        setMessages(history);
      } catch (err) {
        console.error("Error loading message history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [room.id]);

  const handleSendMessage = (pictograms) => {
    sendMessage({
      type: "message",
      content: pictograms
    });
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{room.name}</h2>
          <span className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
            {isConnected ? "● Conectado" : "○ Desconectado"}
          </span>
        </div>
        <button className="btn-secondary" onClick={onLeaveRoom}>
          ← Salir de la sala
        </button>
      </div>

      {error && (
        <div className="error-banner">
          Error de conexión: {error}
        </div>
      )}

      <div className="chat-body">
        {loadingHistory ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando mensajes...</p>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={currentUser.id} />
        )}
      </div>

      <div className="chat-footer">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
