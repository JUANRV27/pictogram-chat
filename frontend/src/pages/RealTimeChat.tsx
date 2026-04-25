import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import RoomSelector from "../components/RoomSelector";
import ChatRoom from "../components/ChatRoom";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { Button } from "../components/ui/button";
import { ArrowLeft, KeyRound, LogOut, MessageCircle } from "lucide-react";

type User = {
  username: string;
  [key: string]: unknown;
};

export default function RealtimeChat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser) as User);
    }
  }, []);

  const handleAuthSuccess = (newToken: string, user: User) => {
    setToken(newToken);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
  };

  const handlePasswordChangeSuccess = () => {
    alert("Contraseña cambiada exitosamente");
  };

  // Not authenticated - show login/register
  if (!currentUser || !token) {
    return (
      <div className="min-h-screen pt-20 px-4 relative overflow-hidden flex flex-col">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full animate-bounce-slow blur-3xl" />
        </div>

        <div className="container max-w-4xl mx-auto relative z-10 flex flex-col">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="hover-lift">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full animate-fade-in">
              <AuthForm
                onLogin={(token, user) => {
                  try {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                  } catch (e) { }
                  handleAuthSuccess(token, user);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but no room selected - show room selector
  if (!selectedRoom) {
    return (
      <div className="min-h-screen pt-20 px-4 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full animate-bounce-slow blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-accent/20 rounded-full animate-pulse-slow blur-3xl" />
        </div>

        <div className="container max-w-5xl mx-auto relative z-10 space-y-8">
          {/* Header */}
          <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-full hover-lift">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Salas de Chat
                  </span>
                </h1>
                <p className="text-muted-foreground mt-1">Hola, {currentUser.username} 👋</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setShowPasswordModal(true)} className="hover-lift">
                <KeyRound className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="hover-lift">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>

          {/* Room Selector */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <RoomSelector onRoomSelect={handleRoomSelect} currentUser={currentUser} />
          </div>

          {showPasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowPasswordModal(false)}
              onSuccess={handlePasswordChangeSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  // In a chat room
  return (
    <div className="min-h-screen pt-4 pb-4 px-2 md:pt-10 md:pb-10 md:px-4 relative overflow-hidden flex flex-col">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/20 rounded-full animate-bounce-slow blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-5rem)]">
        <ChatRoom
          room={selectedRoom}
          currentUser={currentUser}
          onLeaveRoom={handleLeaveRoom}
        />
      </div>
    </div>
  );
}
