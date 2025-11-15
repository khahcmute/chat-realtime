import React, { useState } from "react";
import { LogOut, Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import RoomList from "./RoomList";
import FriendList from "./FriendList";
import SearchBar from "./SearchBar";

const Sidebar = ({
  rooms,
  friends,
  selectedRoom,
  onSelectRoom,
  onOpenChat,
  showSidebar,
  onCloseSidebar,
  onRefresh,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div
      className={`${
        showSidebar ? "block" : "hidden"
      } md:block w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <h2 className="font-semibold">{user?.username}</h2>
              <p className="text-xs text-blue-100">Đang hoạt động</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCloseSidebar}
              className="md:hidden text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === "chats"
                ? "bg-white text-blue-600"
                : "text-white hover:bg-white hover:bg-opacity-20"
            }`}
          >
            Đoạn chat
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === "friends"
                ? "bg-white text-blue-600"
                : "text-white hover:bg-white hover:bg-opacity-20"
            }`}
          >
            Bạn bè
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chats" ? (
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={onSelectRoom}
            onCloseSidebar={onCloseSidebar}
          />
        ) : (
          <FriendList
            friends={friends}
            onOpenChat={onOpenChat}
            onRefresh={onRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
