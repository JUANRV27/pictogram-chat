import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  imageUrl?: string; // opcional: url del archivo subido
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // scroll al final cuando cambian los mensajes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !file) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: text || "",
      imageUrl: preview || undefined,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setFile(null);
    setPreview(null);
    setLoading(true);

    // mensaje temporal de “escribiendo…”
    const botMsgTemp: Message = { id: "bot-temp", sender: "bot", text: "Ollama está escribiendo..." };
    setMessages((m) => [...m, botMsgTemp]);

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (file) formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/api/ollama", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al contactar a Ollama");

      const data = await res.json();
      // reemplaza el mensaje temporal con la respuesta real
      setMessages((m) =>
        m.map((msg) =>
          msg.id === "bot-temp" ? { id: String(Date.now()), sender: "bot", text: data.response } : msg
        )
      );
    } catch (err) {
      console.error(err);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === "bot-temp"
            ? { id: String(Date.now()), sender: "bot", text: "Error: no se pudo obtener respuesta." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container" style={{ maxWidth: 500, margin: "auto" }}>
      <div
        className="chat-list"
        ref={listRef}
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          borderRadius: 6,
          backgroundColor: "#f0f0f0",
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "8px 0" }}>
            <div
              style={{
                display: "inline-block",
                background: m.sender === "user" ? "#D1FFD6" : "#333333",
                color: m.sender === "user" ? "#000000" : "#FFFFFF",
                padding: "6px 12px",
                borderRadius: 12,
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {m.text}
              {m.imageUrl && (
                <div style={{ marginTop: 6 }}>
                  <img
                    src={m.imageUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", borderRadius: 6 }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          rows={2}
          style={{ flex: 1, padding: 8, borderRadius: 6, resize: "none" }}
        />

        {/* Input oculto */}
        <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} />

        {/* Botón "+" para abrir el selector */}
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{
            width: 32,
            height: 50,
            fontSize: 20,
            fontWeight: "bold",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          +
        </button>

        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && !file)}
          style={{
            padding: "0 12px",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Ollama está escribiendo..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
