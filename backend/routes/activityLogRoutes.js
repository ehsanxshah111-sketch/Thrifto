const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getActivityLogs);

module.exports = router;
