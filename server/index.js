import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

import messageRoute from "./routes/messageRoutes.js";
import userRoute from "./routes/authRoutes.js";
import roomRoute from "./routes/roomRoutes.js";
import friendRoute from "./routes/friendRoutes.js";
import chatRoute from "./routes/chatRoutes.js";

dotenv.config();

// ====================== CONNECT MONGODB ======================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// ====================== ROUTES ======================
app.use("/api/messages", messageRoute);
app.use("/api/users", userRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/friends", friendRoute);
app.use("/api/chats", chatRoute);

// ====================== HTTP SERVER =====================
const server = http.createServer(app);

// ====================== SOCKET.IO =======================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware: Xác thực token khi kết nối socket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("Không có token");
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // gán userId vào socket
    next();
  } catch (err) {
    console.log("Token không hợp lệ");
    next(new Error("Invalid token"));
  }
});

// ====================== SOCKET EVENTS ======================
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  // Typing
  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("typing", socket.userId);
  });

  socket.on("stopTyping", (roomId) => {
    socket.to(roomId).emit("stopTyping", socket.userId);
  });

  // Gửi tin nhắn realtime + lưu DB
  socket.on("sendMessage", async ({ roomId, message }) => {
    // Lưu database
    const saved = await Message.create({
      sender: socket.userId,
      room: roomId,
      text: message,
    });

    // Emit cho tất cả user trong room
    io.to(roomId).emit("newMessage", {
      _id: saved._id,
      sender: { _id: socket.userId },
      text: message,
      room: roomId,
      createdAt: saved.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
