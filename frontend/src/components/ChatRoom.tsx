import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatRoomProps {
  username: string;
  roomId: string;
}

export const ChatRoom = ({ username, roomId }: ChatRoomProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_BACKEND_URL.replace("http", "ws").replace("https", "wss");
    ws.current = new WebSocket(`${wsUrl}/chat/ws/${roomId}/${username}`);
    
    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "message" && data.content) {
          try {
            // Fetch pictograms for the message content
            // We split by space to get individual words, but the API expects a list of "selected" words
            // to recommend the NEXT word. 
            // HOWEVER, the user wants to see pictograms FOR the message.
            // So we should probably search for each word or use a different endpoint.
            // Since we only have /recommend (which predicts next) and search (internal),
            // let's try to misuse /recommend or just search individually if we could.
            // But wait, the user wants to "read words and obtain related pictograms".
            
            // Let's assume we want to show pictograms for the words IN the message.
            // The current /recommend endpoint predicts the NEXT word based on context.
            // It does NOT translate the current sentence to pictograms.
            
            // We need a way to get pictograms for the CURRENT words.
            // I will create a helper to fetch pictograms for the sentence.
            
            const words = data.content.split(" ");
            const pictos = [];
            
            for (const word of words) {
                // Skip short words to avoid noise? Or try to fetch all.
                if (word.length < 2) continue;
                
                try {
                    const res = await fetch(`${import.meta.env.VITE_AI_URL}/search/${word}`);
                    if (res.ok) {
                        const picto = await res.json();
                        if (picto) {
                            pictos.push(picto);
                        }
                    }
                } catch (err) {
                    console.error(`Failed to fetch picto for ${word}`, err);
                }
            }
            
            data.pictograms = pictos;
          } catch (e) {
              console.error("Error fetching pictograms", e);
          }
      }
      
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (input.trim() && ws.current) {
      ws.current.send(JSON.stringify({ content: input, type: "message" }));
      setInput("");
    }
  };

  return (
    <Card className="h-[600px] flex flex-col p-4">
      <div className="mb-4 border-b pb-2">
        <h2 className="text-xl font-bold">Sala: {roomId}</h2>
        <p className="text-sm text-muted-foreground">Usuario: {username}</p>
      </div>
      
      <div className="flex-1 pr-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.user === username ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === "system" ? "bg-muted text-center w-full text-xs" :
                msg.user === username ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}>
                {msg.type !== "system" && <p className="text-xs font-bold mb-1">{msg.user}</p>}
                <p>{msg.content}</p>
              </div>
              
              {/* Pictogram Display for Messages */}
              {msg.type !== "system" && msg.pictograms && msg.pictograms.length > 0 && (
                 <div className="flex gap-1 mt-1 flex-wrap max-w-[80%] justify-end">
                    {msg.pictograms.map((pic: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                            <img src={pic.url} alt={pic.palabra} className="w-8 h-8 md:w-12 md:h-12" />
                            <span className="text-[10px] text-muted-foreground">{pic.palabra}</span>
                        </div>
                    ))}
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
        />
        <Button onClick={sendMessage}>Enviar</Button>
      </div>
    </Card>
  );
};
