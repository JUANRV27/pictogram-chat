// API base URL - uses environment variable in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL;

// Auth API functions
export const authApi = {
  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }
    
    return await response.json();
  },

  async login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }
    
    return await response.json();
  },

  async logout(token) {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    
    return await response.json();
  },

  async getCurrentUser(token) {
    const response = await fetch(`${API_URL}/auth/me?token=${token}`);
    
    if (!response.ok) {
      throw new Error("Invalid token");
    }
    
    return await response.json();
  },

  async changePassword(oldPassword, newPassword, token) {
    const response = await fetch(`${API_URL}/auth/change-password?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        old_password: oldPassword, 
        new_password: newPassword 
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to change password");
    }
    
    return await response.json();
  },

  async resetPassword(email, username, newPassword) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email,
        username,
        new_password: newPassword 
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to reset password");
    }
    
    return await response.json();
  }
};

// Chat API functions
export const chatApi = {
  async createRoom(name, token) {
    const response = await fetch(`${API_URL}/chat/rooms?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create room");
    }
    
    return await response.json();
  },

  async getRooms() {
    const response = await fetch(`${API_URL}/chat/rooms`);
    return await response.json();
  },

  async getMessages(roomId, limit = 50) {
    const response = await fetch(`${API_URL}/chat/rooms/${roomId}/messages?limit=${limit}`);
    return await response.json();
  },

  async deleteRoom(roomId, token) {
    const response = await fetch(`${API_URL}/chat/rooms/${roomId}?token=${token}`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete room");
    }
    
    return await response.json();
  },

  createWebSocket(roomId, token) {
    // Convert http/https to ws/wss
    const WS_URL = API_URL.replace(/^http/, 'ws');
    return new WebSocket(`${WS_URL}/chat/ws/${roomId}?token=${token}`);
  }
};
