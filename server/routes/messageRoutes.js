import express from "express";
import Message from "../models/messageModel.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Lấy tất cả tin nhắn của room
router.get("/:roomId", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ room: req.params.roomId })
    .populate("sender", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json(messages.reverse());
});

// Gửi tin nhắn (REST API)
router.post("/:roomId", verifyToken, async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.userId,
      room: req.params.roomId,
      text: req.body.text,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
