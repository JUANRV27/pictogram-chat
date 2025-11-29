from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
from app.core.database import get_db
from app.models.chat import ChatRoom, Message
from app.models.user import User
from app.routers.auth import get_current_user_dep, active_sessions
import json

router = APIRouter(prefix="/chat", tags=["chat"])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}  # {room_id: [websockets]}
    
    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: int):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
    
    async def broadcast(self, message: dict, room_id: int):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

# Pydantic models
class RoomCreate(BaseModel):
    name: str

class RoomResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: List[dict]  # List of pictogram objects

class MessageResponse(BaseModel):
    id: int
    room_id: int
    user_id: int
    username: str
    content: List[dict]
    timestamp: datetime

# REST Endpoints
@router.post("/rooms", response_model=RoomResponse)
def create_room(
    room_data: RoomCreate,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dep)
):
    """Create a new chat room"""
    # Check if room name exists
    if db.query(ChatRoom).filter(ChatRoom.name == room_data.name).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room name already exists"
        )
    
    new_room = ChatRoom(
        name=room_data.name,
        created_by=current_user.id
    )
    
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    
    return new_room

@router.get("/rooms", response_model=List[RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    """Get all chat rooms"""
    rooms = db.query(ChatRoom).order_by(ChatRoom.created_at.desc()).all()
    return rooms

@router.get("/rooms/{room_id}/messages")
def get_messages(room_id: int, limit: int = 50, db: Session = Depends(get_db)):
    """Get message history for a room"""
    room = db.query(ChatRoom).filter(ChatRoom.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    messages = (
        db.query(Message, User.username)
        .join(User, Message.user_id == User.id)
        .filter(Message.room_id == room_id)
        .order_by(Message.timestamp.asc())
        .limit(limit)
        .all()
    )
    
    return [
        {
            "id": msg.id,
            "room_id": msg.room_id,
            "user_id": msg.user_id,
            "username": username,
            "content": msg.get_pictograms(),
            "timestamp": msg.timestamp
        }
        for msg, username in messages
    ]

@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: int,
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_dep)
):
    """Delete a chat room (only creator can delete)"""
    room = db.query(ChatRoom).filter(ChatRoom.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    # Check if current user is the creator
    if room.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the room creator can delete this room"
        )
    
    # Delete the room (messages will be deleted automatically due to cascade)
    db.delete(room)
    db.commit()
    
    return {"message": "Room deleted successfully"}

# WebSocket endpoint
@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time chat"""
    # Authenticate user
    user_id = active_sessions.get(token)
    if not user_id:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Check if room exists
    room = db.query(ChatRoom).filter(ChatRoom.id == room_id).first()
    if not room:
        await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA)
        return
    
    await manager.connect(websocket, room_id)
    
    # Notify others that user joined
    await manager.broadcast({
        "type": "user_joined",
        "username": user.username,
        "user_id": user.id
    }, room_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            if data.get("type") == "message":
                # Save message to database
                new_message = Message(
                    room_id=room_id,
                    user_id=user.id,
                )
                new_message.set_pictograms(data.get("content", []))
                
                db.add(new_message)
                db.commit()
                db.refresh(new_message)
                
                # Broadcast to all users in room
                await manager.broadcast({
                    "type": "message",
                    "id": new_message.id,
                    "room_id": room_id,
                    "user_id": user.id,
                    "username": user.username,
                    "content": new_message.get_pictograms(),
                    "timestamp": new_message.timestamp.isoformat()
                }, room_id)
            
            elif data.get("type") == "typing":
                # Broadcast typing indicator (don't save to DB)
                await manager.broadcast({
                    "type": "typing",
                    "user_id": user.id,
                    "username": user.username
                }, room_id)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        # Notify others that user left
        await manager.broadcast({
            "type": "user_left",
            "username": user.username,
            "user_id": user.id
        }, room_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
