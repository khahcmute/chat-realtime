import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./models/messageModel.js";
import User from "./models/userModel.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================== MONGODB ==================
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ================== EXPRESS + SOCKET.IO ==================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // cho phép tất cả client connect
    methods: ["GET", "POST"],
  },
});

// ================== SOCKET.IO EVENTS ==================
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Khi user join vào 1 room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.emit("joined_room", `You joined room ${roomId}`);
  });

  // Khi client gửi tin nhắn
  socket.on("send_message", async (data) => {
    const { roomId, senderId, text } = data;
    console.log(`Message from ${senderId} in room ${roomId}: ${text}`);

    // Lưu vào DB
    const newMsg = new Message({ sender: senderId, text });
    await newMsg.save();

    // Phát lại tin nhắn cho room
    io.to(roomId).emit("receive_message", {
      senderId,
      text,
      createdAt: newMsg.createdAt,
    });
  });

  // Khi user ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ================== START SERVER ==================
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
