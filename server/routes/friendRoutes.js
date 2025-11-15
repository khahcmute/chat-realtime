import express from "express";
import User from "../models/userModel.js";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// Tìm bạn
router.get("/search", verifyToken, async (req, res) => {
  const { q } = req.query;

  const users = await User.find({
    username: { $regex: q, $options: "i" },
    _id: { $ne: req.userId },
  }).select("username");

  res.json(users);
});

// Gửi lời mời kết bạn
router.post("/add", verifyToken, async (req, res) => {
  const { toUserId } = req.body;

  await User.findByIdAndUpdate(toUserId, {
    $push: { friendRequests: { from: req.userId } },
  });

  res.json({ message: "Friend request sent" });
});

// Đồng ý kết bạn
router.post("/accept", verifyToken, async (req, res) => {
  const { fromUserId } = req.body;

  await User.findByIdAndUpdate(req.userId, {
    $pull: { friendRequests: { from: fromUserId } },
    $push: { friends: fromUserId },
  });

  await User.findByIdAndUpdate(fromUserId, {
    $push: { friends: req.userId },
  });

  res.json({ message: "Friend added" });
});

// Danh sách bạn bè
router.get("/list", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).populate("friends", "username");

  res.json(user.friends);
});

export default router;
