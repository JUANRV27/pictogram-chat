import { useState, useEffect } from "react";
import { chatApi } from "../api/chatApi";

export default function RoomSelector({ onRoomSelect, currentUser }) {
  const [rooms, setRooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await chatApi.getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Error loading rooms:", err);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const newRoom = await chatApi.createRoom(newRoomName, token);
      setRooms([newRoom, ...rooms]);
      setNewRoomName("");
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomName, e) => {
    e.stopPropagation(); // Prevent triggering onRoomSelect
    
    if (!confirm(`¿Estás seguro de que quieres eliminar la sala "${roomName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await chatApi.deleteRoom(roomId, token);
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="room-selector">
      <div className="room-header">
        <h2>Salas de Chat</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancelar" : "+ Nueva Sala"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Nombre de la sala"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Sala"}
          </button>
        </form>
      )}

      <div className="room-list">
        {rooms.length === 0 ? (
          <div className="empty-state">
            No hay salas disponibles. ¡Crea una nueva!
          </div>
        ) : (
          rooms.map(room => {
            // Debug logging
            console.log('Room:', room.name, 'created_by:', room.created_by, 'currentUser.id:', currentUser.id, 'match:', room.created_by == currentUser.id);
            
            return (
              <div
                key={room.id}
                className="room-item"
                onClick={() => onRoomSelect(room)}
              >
                <div className="room-info">
                  <div className="room-name">{room.name}</div>
                  <div className="room-meta">
                    Creada: {new Date(room.created_at).toLocaleDateString()}
                  </div>
                </div>
                {room.created_by == currentUser.id && (
                  <button
                    className="btn-delete-room"
                    onClick={(e) => handleDeleteRoom(room.id, room.name, e)}
                    title="Eliminar sala"
                  >
                    ❌
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
