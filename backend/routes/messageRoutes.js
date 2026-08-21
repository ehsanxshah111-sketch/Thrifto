const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markMessageRead } = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', sendMessage); // public contact form

// Admin only - read customer messages
router.get('/', protect, adminOnly, getMessages);
router.patch('/:id/read', protect, adminOnly, markMessageRead);

module.exports = router;
