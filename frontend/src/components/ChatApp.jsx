import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import RoomSelector from "./RoomSelector";
import ChatRoom from "./ChatRoom";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ChatApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (newToken, user) => {
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

  const handleRoomSelect = (room) => {
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
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated but no room selected - show room selector
  if (!selectedRoom) {
    return (
      <div className="app-container">
        <div className="app-header">
          <h1>Pictogram Chat</h1>
          <div className="user-info">
            <span>Hola, {currentUser.username}!</span>
            <button 
              className="btn-link" 
              onClick={() => setShowPasswordModal(true)}
              style={{ marginRight: '1rem' }}
            >
              Cambiar Contraseña
            </button>
            <button className="btn-link" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        <RoomSelector onRoomSelect={handleRoomSelect} currentUser={currentUser} />
        
        {showPasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordChangeSuccess}
          />
        )}
      </div>
    );
  }

  // In a chat room
  return (
    <div className="app-container">
      <ChatRoom
        room={selectedRoom}
        currentUser={currentUser}
        onLeaveRoom={handleLeaveRoom}
      />
    </div>
  );
}
