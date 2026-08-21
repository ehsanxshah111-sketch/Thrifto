const mongoose = require('mongoose');

// One row per admin action - who did it, what they did, and where from.
// Nothing here is ever edited after creation; it's a straight audit trail.
const activityLogSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },   // display name at the time of the action
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    role: { type: String, default: '' },
    action: { type: String, required: true }, // e.g. "Created product", "Logged in"
    module: { type: String, default: '' },    // e.g. "Products", "Orders", "Auth"
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    details: { type: String, default: '' },
    device: { type: String, default: '' },    // friendly parsed label, e.g. "Chrome on Windows"
    userAgent: { type: String, default: '' }, // raw User-Agent header, kept for reference
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
