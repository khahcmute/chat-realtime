const API_BASE = "http://localhost:5000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

const api = {
  // Auth
  register: async (username, password) => {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  // Friends
  searchFriends: async (token, query) => {
    const response = await fetch(`${API_BASE}/friends/search?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  addFriend: async (token, toUserId) => {
    const response = await fetch(`${API_BASE}/friends/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toUserId }),
    });
    return handleResponse(response);
  },

  acceptFriend: async (token, fromUserId) => {
    const response = await fetch(`${API_BASE}/friends/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fromUserId }),
    });
    return handleResponse(response);
  },

  getFriendList: async (token) => {
    const response = await fetch(`${API_BASE}/friends/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  // Chat
  openChat: async (token, userId2) => {
    const response = await fetch(`${API_BASE}/chat/open`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId2 }),
    });
    return handleResponse(response);
  },

  // Rooms
  getRooms: async (token) => {
    const response = await fetch(`${API_BASE}/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  getRoomDetails: async (token, roomId) => {
    const response = await fetch(`${API_BASE}/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  },

  createRoom: async (token, name, members) => {
    const response = await fetch(`${API_BASE}/rooms/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, members }),
    });
    return handleResponse(response);
  },

  addMember: async (token, roomId, userId) => {
    const response = await fetch(`${API_BASE}/rooms/addMember`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, userId }),
    });
    return handleResponse(response);
  },

  leaveRoom: async (token, roomId) => {
    const response = await fetch(`${API_BASE}/rooms/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });
    return handleResponse(response);
  },

  // Messages
  getMessages: async (token, roomId, page = 1, limit = 50) => {
    const response = await fetch(
      `${API_BASE}/messages/${roomId}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return handleResponse(response);
  },

  sendMessage: async (token, roomId, text) => {
    const response = await fetch(`${API_BASE}/messages/${roomId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

export default api;
