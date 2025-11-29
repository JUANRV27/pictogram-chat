import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-state">
          No hay mensajes aún. ¡Sé el primero en enviar uno!
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isOwnMessage = msg.user_id === currentUserId;

        return (
          <div
            key={msg.id}
            className={`message ${isOwnMessage ? "own-message" : "other-message"}`}
          >
            <div className="message-header">
              <span className="message-username">{msg.username}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>

            <div className="message-content">
              {msg.content && msg.content.length > 0 ? (
                <div className="pictogram-sentence">
                  {msg.content.map((picto, idx) => (
                    <div key={idx} className="pictogram-item">
                      <img src={picto.url || picto.imagen} alt={picto.palabra} />
                      <span>{picto.palabra}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">Mensaje vacío</div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
