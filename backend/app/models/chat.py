from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import json

class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    messages = relationship("Message", back_populates="room", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)  # JSON string with pictogram data
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    room = relationship("ChatRoom", back_populates="messages")
    user = relationship("User", back_populates="messages")
    
    def get_pictograms(self):
        """Parse JSON content to get pictogram list"""
        try:
            return json.loads(self.content)
        except:
            return []
    
    def set_pictograms(self, pictograms: list):
        """Store pictogram list as JSON"""
        self.content = json.dumps(pictograms, ensure_ascii=False)
