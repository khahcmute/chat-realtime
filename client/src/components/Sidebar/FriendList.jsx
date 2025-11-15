import React from "react";
import { MessageCircle, Users, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

const FriendList = ({ friends, onOpenChat, onRefresh }) => {
  const { token } = useAuth();

  const handleAcceptFriend = async (friendId) => {
    try {
      await api.acceptFriend(token, friendId);
      onRefresh();
    } catch (err) {
      console.error("Accept friend error:", err);
      alert("Không thể chấp nhận lời mời: " + err.message);
    }
  };

  if (friends.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">Chưa có bạn bè</p>
        <p className="text-sm mt-2">Sử dụng thanh tìm kiếm để thêm bạn bè!</p>
      </div>
    );
  }

  return (
    <div>
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
              onClick={() =>
                friend.status === "accepted" && onOpenChat(friend._id)
              }
            >
              <span className="text-white font-bold text-lg">
                {friend.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() =>
                friend.status === "accepted" && onOpenChat(friend._id)
              }
            >
              <h3 className="font-semibold text-gray-800 truncate">
                {friend.username}
              </h3>
              <p className="text-xs text-gray-500">
                {friend.status === "pending" ? (
                  <span className="text-orange-500">● Đang chờ</span>
                ) : (
                  <span className="text-green-500">● Bạn bè</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {friend.status === "pending" && friend.isPendingFrom && (
                <>
                  <button
                    onClick={() => handleAcceptFriend(friend._id)}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    title="Chấp nhận"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    title="Từ chối"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              {friend.status === "accepted" && (
                <button
                  onClick={() => onOpenChat(friend._id)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  title="Nhắn tin"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
