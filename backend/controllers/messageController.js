const Message = require('../models/Message');

// @route  POST /api/messages
// @desc   Public contact form - anyone can send a message
const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }
  const saved = await Message.create({ name, email, subject, message });
  res.status(201).json({ message: 'Message sent successfully', data: saved });
};

// @route  GET /api/messages
// @desc   Admin only - view every message sent through the contact form
const getMessages = async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
};

// @route  PATCH /api/messages/:id/read
// @desc   Admin only - mark a message as read
const markMessageRead = async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: 'Message not found' });
  msg.read = true;
  await msg.save();
  res.json(msg);
};

module.exports = { sendMessage, getMessages, markMessageRead };
