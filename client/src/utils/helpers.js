// Get display name for room (for 1-1 chat, show other person's name)
export const getRoomDisplayName = (room, currentUserId) => {
  if (!room) return "Unknown";

  // If it's a group chat or has a custom name
  if (room.isGroup || room.name) {
    return room.name || "Group Chat";
  }

  // For 1-1 chat, find the other user
  if (room.members && Array.isArray(room.members)) {
    const otherMember = room.members.find((member) => {
      const memberId = typeof member === "object" ? member._id : member;
      return memberId !== currentUserId;
    });

    if (otherMember) {
      return typeof otherMember === "object"
        ? otherMember.username
        : otherMember;
    }
  }

  // If we have userId1 and userId2 fields
  if (room.userId1 && room.userId2) {
    const otherUser =
      room.userId1 === currentUserId ? room.userId2 : room.userId1;
    return typeof otherUser === "object" ? otherUser.username : otherUser;
  }

  return "Private Chat";
};

// Get initial for avatar
export const getInitial = (name) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

// Format time
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return "Hôm nay";
  } else if (d.toDateString() === yesterday.toDateString()) {
    return "Hôm qua";
  } else {
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

// Check if message is from current user
export const isOwnMessage = (message, currentUserId) => {
  if (!message || !currentUserId) return false;

  // Normalize IDs to string for comparison
  const normalizeId = (id) => {
    if (!id) return null;
    if (typeof id === "object" && id._id) return id._id.toString();
    return id.toString();
  };

  const currentId = normalizeId(currentUserId);

  // Check senderId first (most common case)
  if (message.senderId) {
    const senderId = normalizeId(message.senderId);
    if (senderId === currentId) return true;
  }

  // Check sender object
  if (message.sender) {
    const senderId = normalizeId(message.sender);
    if (senderId === currentId) return true;
  }

  // Check userId field (alternative field name)
  if (message.userId) {
    const senderId = normalizeId(message.userId);
    if (senderId === currentId) return true;
  }

  // Check from field
  if (message.from) {
    const senderId = normalizeId(message.from);
    if (senderId === currentId) return true;
  }

  return false;
};
