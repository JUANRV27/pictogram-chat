import { useState, useEffect, useCallback } from "react";
import { chatApi } from "../api/chatApi";
import useWebSocket from "../hooks/useWebSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";

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
    <div className="glass-card rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-primary/10">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur border-b border-border/50 p-4 sm:p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onLeaveRoom} className="rounded-full hover:bg-primary/10 hover:text-primary hover-lift">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {room.name}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
              {isConnected ? (
                <><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span></span> <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span></>
              ) : (
                <><WifiOff className="w-3 h-3 text-destructive" /> <span className="text-destructive font-medium">Desconectado</span></>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 text-destructive px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" /> Error de conexión: {error}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-transparent to-background/50">
        {loadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Cargando mensajes mágicos...</p>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={currentUser.id} />
        )}
      </div>

      {/* Footer */}
      <div className="bg-card/80 backdrop-blur border-t border-border/50 p-4 z-10">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
