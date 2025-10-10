import express from "express";
import Message from "../models/messageModel.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const messages = await Message.find()
    .populate("sender", "username")
    .sort({ createdAt: 1 });
  res.json(messages);
});

export default router;
