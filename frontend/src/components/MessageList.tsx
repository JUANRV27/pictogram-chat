import { useEffect, useRef } from "react";
import { MessageSquareOff } from "lucide-react";

export default function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in opacity-80">
        <MessageSquareOff className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">No hay mensajes aún</h3>
        <p className="text-muted-foreground max-w-sm">¡Sé el primero en enviar uno usando los pictogramas de abajo!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      {messages.map((msg) => {
        const isOwnMessage = msg.user_id === currentUserId;

        return (
          <div
            key={msg.id}
            className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-2xl shadow-sm animate-fade-in ${
              isOwnMessage 
                ? "self-end bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 rounded-tr-sm" 
                : "self-start bg-card border border-border/50 rounded-tl-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2 text-xs sm:text-sm opacity-80">
              <span className="font-bold text-foreground">{msg.username}</span>
              <span className="text-muted-foreground ml-4">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>

            <div className="mt-2">
              {msg.content && msg.content.length > 0 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  {msg.content.map((picto, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl border ${
                        isOwnMessage ? 'bg-background/40 border-primary/20' : 'bg-muted/50 border-border/50'
                      }`}
                    >
                      <img 
                        src={picto.url || picto.imagen} 
                        alt={picto.palabra} 
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />
                      <span className="text-[10px] sm:text-xs font-semibold mt-1 text-center max-w-[60px] truncate">
                        {picto.palabra}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">Mensaje vacío</div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}
