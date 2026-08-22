const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Only image files (jpg, png, webp, gif, svg) are allowed'));
};

// Buffer the file in memory rather than writing straight to disk. The route
// handler decides where the buffer actually ends up (Vercel Blob in
// production, local disk in development) — see routes/uploadRoutes.js.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
