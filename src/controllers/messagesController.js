import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;

    if (!to || !content) {
      return res
        .status(400)
        .json({ message: "Recipient and content are required" });
    }

    const message = new Message({
      from: req.user._id,
      to,
      content,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// List messages for authenticated user
export const listMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
    })
      .populate("from", "name email profileImage")
      .populate("to", "name email profileImage")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
