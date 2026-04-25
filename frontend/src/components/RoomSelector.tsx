import { useState, useEffect } from "react";
import { chatApi } from "../api/chatApi";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-xl border border-primary/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Unirse a una Sala
        </h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? "secondary" : "default"}
          className={`hover-lift ${!showCreateForm && 'bg-primary hover:bg-primary/90 text-white shadow-lg'}`}
        >
          {showCreateForm ? "Cancelar" : <><Plus className="w-4 h-4 mr-2" /> Nueva Sala</>}
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="glass rounded-xl p-4 mb-8 animate-fade-in flex flex-col sm:flex-row gap-4 border border-primary/20">
          {error && <div className="text-destructive w-full sm:w-auto p-2 bg-destructive/10 rounded">{error}</div>}
          <Input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Escribe el nombre de la nueva sala..."
            required
            className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white hover-lift">
            {loading ? "Creando..." : "Crear Sala"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center p-12 glass rounded-xl border border-dashed border-primary/30">
            <p className="text-muted-foreground text-lg mb-2">No hay salas disponibles.</p>
            <p className="text-primary font-medium">¡Crea la primera y empieza a chatear!</p>
          </div>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className="group glass rounded-xl p-5 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-32 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start">
                <div className="font-semibold text-lg text-foreground truncate pr-2">{room.name}</div>
                {room.created_by == currentUser.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                    onClick={(e) => handleDeleteRoom(room.id, room.name, e)}
                    title="Eliminar sala"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-auto">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Creada: {new Date(room.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
