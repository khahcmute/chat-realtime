import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./components/Auth/LoginScreen";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatWindow from "./components/Chat/ChatWindow";
import api from "./api";

function App() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Load rooms and friends
  useEffect(() => {
    if (token) {
      loadRooms();
      loadFriends();
    }
  }, [token]);

  // Load messages when room is selected
  useEffect(() => {
    if (selectedRoom && token) {
      loadMessages(selectedRoom._id);

      // Auto-refresh messages every 3 seconds
      const interval = setInterval(() => {
        loadMessages(selectedRoom._id);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedRoom, token]);

  const loadRooms = async () => {
    try {
      const data = await api.getRooms(token);
      setRooms(data || []);
    } catch (err) {
      console.error("Load rooms error:", err);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await api.getFriendList(token);
      setFriends(data || []);
    } catch (err) {
      console.error("Load friends error:", err);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const data = await api.getMessages(token, roomId);
      setMessages(data || []);
    } catch (err) {
      console.error("Load messages error:", err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedRoom) return;

    try {
      await api.sendMessage(token, selectedRoom._id, text);
      await loadMessages(selectedRoom._id);
    } catch (err) {
      console.error("Send message error:", err);
      alert("Không thể gửi tin nhắn: " + err.message);
    }
  };

  const handleOpenChat = async (friendId) => {
    try {
      const data = await api.openChat(token, friendId);
      if (data) {
        await loadRooms();
        setSelectedRoom(data);
        setShowSidebar(false);
      }
    } catch (err) {
      console.error("Open chat error:", err);
      alert("Không thể mở chat: " + err.message);
    }
  };

  const handleRefresh = () => {
    loadRooms();
    loadFriends();
  };

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        rooms={rooms}
        friends={friends}
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
        onOpenChat={handleOpenChat}
        showSidebar={showSidebar}
        onCloseSidebar={() => setShowSidebar(false)}
        onRefresh={handleRefresh}
      />

      <ChatWindow
        selectedRoom={selectedRoom}
        messages={messages}
        onSendMessage={handleSendMessage}
        onShowSidebar={() => setShowSidebar(true)}
      />
    </div>
  );
}

export default App;
