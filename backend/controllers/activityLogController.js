const ActivityLog = require('../models/ActivityLog');

// @route  GET /api/activity-logs
// @desc   Admin only - most recent activity first. Optional ?limit= (capped
//         at 500) and ?module= to filter down to one area (e.g. "Products").
const getActivityLogs = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
  const filter = {};
  if (req.query.module) filter.module = req.query.module;

  const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit);
  res.json(logs);
};

module.exports = { getActivityLogs };
