import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { ChatRoom } from "@/components/ChatRoom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RealTimeChat = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("general");

  const handleLogin = (t: string, u: string) => {
    setToken(t);
    setUsername(u);
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-center gradient-primary bg-clip-text text-transparent">
        Chat en Tiempo Real
      </h1>
      
      {!token ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <ChatRoom username={username!} roomId={roomId} />
      )}
    </div>
  );
};

export default RealTimeChat;
