import { Router } from "express";
import Message from "../models/Message.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// POST a new message
router.post("/", auth, async (req, res) => {
  const { to, content } = req.body;

  if (!to || !content) {
    return res
      .status(400)
      .json({ message: "Recipient and content are required" });
  }

  try {
    const message = await Message.create({
      from: req.user._id,
      to,
      content,
    });

    const populatedMessage = await message
      .populate("from", "name profileImage")
      .populate("to", "name profileImage")
      .execPopulate();

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all messages for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate("from", "name profileImage")
      .populate("to", "name profileImage")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
