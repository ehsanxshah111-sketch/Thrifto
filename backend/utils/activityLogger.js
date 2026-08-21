const ActivityLog = require('../models/ActivityLog');

// Lightweight device/browser guess from the User-Agent string - just enough
// to show "Chrome on Windows" or "Safari on iPhone" in the log instead of a
// wall of raw UA text. No external dependency needed for this.
const parseDevice = (ua = '') => {
  if (!ua) return 'Unknown device';

  let browser = 'Unknown browser';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\//.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';

  let os = 'Unknown OS';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Macintosh|Mac OS X/.test(ua)) os = 'Mac';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Linux/.test(ua)) os = 'Linux';

  return `${browser} on ${os}`;
};

// Call this after a mutation succeeds. `actor` defaults to req.user (the
// logged-in admin from the protect middleware) but can be overridden - the
// login route needs this since req.user isn't set yet at that point (the
// person isn't authenticated until the login call itself succeeds).
const logActivity = async (req, { action, module = '', entityId = null, details = '', actor = null }) => {
  try {
    const who = actor || req.user;
    const ua = req.headers['user-agent'] || '';
    await ActivityLog.create({
      user: who?.name || 'Unknown',
      userId: who?._id || null,
      role: who?.role || '',
      action,
      module,
      entityId,
      details,
      device: parseDevice(ua),
      userAgent: ua,
      ip: (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString(),
    });
  } catch (err) {
    // Logging must never break the actual request it's attached to.
    console.error('Activity log error:', err.message);
  }
};

module.exports = { logActivity, parseDevice };
