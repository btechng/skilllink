import { Router } from "express";
import Message from "../models/Message.js";
import { auth } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/messages
 * Create a new message
 */
router.post("/", auth, async (req, res) => {
  const { to, content, replyTo } = req.body;

  if (!to || !content) {
    return res
      .status(400)
      .json({ message: "Recipient and content are required" });
  }

  try {
    const messageData = {
      from: req.user._id,
      to,
      content,
    };

    if (replyTo) {
      messageData.replyTo = replyTo; // Optional: link to original message
    }

    const message = await Message.create(messageData);

    // Populate sender and recipient info
    const populatedMessage = await message
      .populate("from", "name profileImage")
      .populate("to", "name profileImage");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/messages
 * Get all messages involving the authenticated user
 */
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate("from", "name profileImage")
      .populate("to", "name profileImage")
      .populate("replyTo") // optional: populate replied message
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/messages/:id
 * Get a single message by ID
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("from", "name profileImage")
      .populate("to", "name profileImage")
      .populate("replyTo");

    if (!message) return res.status(404).json({ message: "Message not found" });

    // Ensure the user is part of the conversation
    if (
      message.from._id.toString() !== req.user._id.toString() &&
      message.to._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/messages/:id
 * Delete a message (sender only)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.from.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the sender can delete a message" });
    }

    await message.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
