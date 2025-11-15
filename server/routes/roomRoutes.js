import express from "express";
import Room from "../models/roomModel.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Lấy tất cả room mà user đang ở
router.get("/", verifyToken, async (req, res) => {
  const rooms = await Room.find({ members: req.userId }).populate(
    "members",
    "username"
  );

  res.json(rooms);
});

// Tạo room mới
router.post("/create", verifyToken, async (req, res) => {
  const { name, members } = req.body;

  // thêm người tạo room vào danh sách thành viên
  const room = await Room.create({
    name,
    members: [...members, req.userId],
  });

  res.status(201).json(room);
});

// Thêm thành viên vào phòng
router.post("/addMember", verifyToken, async (req, res) => {
  const { roomId, userId } = req.body;

  await Room.findByIdAndUpdate(roomId, {
    $addToSet: { members: userId },
  });

  res.json({ message: "Member added" });
});

router.post("/leave", verifyToken, async (req, res) => {
  const { roomId } = req.body;

  await Room.findByIdAndUpdate(roomId, {
    $pull: { members: req.userId },
  });

  res.json({ message: "Left room" });
});


export default router;
