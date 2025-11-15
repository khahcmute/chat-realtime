import express from "express";
import Room from "../models/roomModel.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Tạo hoặc lấy room giữa 2 user
router.post("/open", verifyToken, async (req, res) => {
  const { userId2 } = req.body;

  let room = await Room.findOne({
    members: { $all: [req.userId, userId2] },
  });

  if (!room) {
    room = await Room.create({
      name: null,
      members: [req.userId, userId2],
    });
  }

  res.json(room);
});

export default router;
