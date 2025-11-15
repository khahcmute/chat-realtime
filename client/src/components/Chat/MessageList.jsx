import React, { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { formatTime, isOwnMessage } from "../../utils/helpers";

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="space-y-4">
        {messages.map((message, index) => {
          // Kiểm tra xem tin nhắn có phải của mình không
          const isOwn = isOwnMessage(message, user?._id);

          const prevMessage = index > 0 ? messages[index - 1] : null;
          const prevIsOwn = prevMessage
            ? isOwnMessage(prevMessage, user?._id)
            : null;
          const showAvatar = index === 0 || prevIsOwn !== isOwn;

          // Get sender info
          let senderName = "Unknown";
          if (message.sender) {
            senderName =
              typeof message.sender === "object"
                ? message.sender.username
                : message.sender;
          } else if (message.senderId) {
            senderName =
              typeof message.senderId === "object"
                ? message.senderId.username
                : message.senderId;
          }

          return (
            <div
              key={message._id || index}
              className={`flex items-end gap-2 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar TRÁI - Người khác */}
              {!isOwn && (
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0 ${
                    !showAvatar ? "invisible" : ""
                  }`}
                >
                  <span className="text-white text-xs font-bold">
                    {senderName[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}

              <div
                className={`flex flex-col max-w-xs md:max-w-md ${
                  isOwn ? "items-end" : "items-start"
                }`}
              >
                {/* Tên người gửi - chỉ cho người khác */}
                {!isOwn && showAvatar && (
                  <span className="text-xs text-gray-500 mb-1 px-2">
                    {senderName}
                  </span>
                )}

                {/* Bubble tin nhắn */}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwn
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                </div>

                {/* Thời gian */}
                <span className="text-xs text-gray-400 mt-1 px-2">
                  {formatTime(message.createdAt || message.timestamp)}
                </span>
              </div>

              {/* Avatar PHẢI - Bạn */}
              {isOwn && (
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 ${
                    !showAvatar ? "invisible" : ""
                  }`}
                >
                  <span className="text-white text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
