import React from "react";
import { Menu, Users, MoreVertical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getRoomDisplayName, getInitial } from "../../utils/helpers";

const ChatHeader = ({ room, onShowSidebar }) => {
  const { user } = useAuth();
  const displayName = getRoomDisplayName(room, user?._id);

  return (
    <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onShowSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            {room.isGroup ? (
              <Users className="w-5 h-5 text-white" />
            ) : (
              <span className="text-white font-bold">
                {getInitial(displayName)}
              </span>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">{displayName}</h2>
            <p className="text-xs text-gray-500">
              {room.isGroup
                ? `${room.memberCount || 0} thành viên`
                : "Đang hoạt động"}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
