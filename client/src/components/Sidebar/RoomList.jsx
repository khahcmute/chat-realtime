import React from "react";
import { MessageSquare, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getRoomDisplayName, getInitial } from "../../utils/helpers";

const RoomList = ({ rooms, selectedRoom, onSelectRoom, onCloseSidebar }) => {
  const { user } = useAuth();
  if (rooms.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">Chưa có đoạn chat nào</p>
        <p className="text-sm mt-2">Tìm bạn bè và bắt đầu trò chuyện!</p>
      </div>
    );
  }

  return (
    <div>
      {rooms.map((room) => (
        <div
          key={room._id}
          onClick={() => {
            onSelectRoom(room);
            onCloseSidebar();
          }}
          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${
            selectedRoom?._id === room._id
              ? "bg-blue-50 border-l-4 border-l-blue-500"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              {room.isGroup ? (
                <Users className="w-6 h-6 text-white" />
              ) : (
                <span className="text-white font-bold text-lg">
                  {room.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 truncate">
                  {room.name || "Unnamed Room"}
                </h3>
                {room.lastMessageTime && (
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(room.lastMessageTime).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {room.lastMessage || "Bắt đầu cuộc trò chuyện..."}
              </p>
            </div>
            {room.unreadCount > 0 && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {room.unreadCount > 9 ? "9+" : room.unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
