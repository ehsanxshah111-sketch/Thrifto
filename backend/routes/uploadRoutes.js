const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// If a Vercel Blob token is configured (set automatically once you enable
// Blob storage on the Vercel project — see README), store uploads there
// since it's the only piece of this app's disk usage that needs to survive
// across serverless invocations. Otherwise (plain local dev) fall back to
// writing to backend/uploads/ like before.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// @route  POST /api/upload
// @desc   Admin only - upload a product photo. Returns the URL to store on
//         the product's "image" field.
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path
      .extname(req.file.originalname)
      .toLowerCase()}`;

    try {
      if (useBlob) {
        const { put } = require('@vercel/blob');
        const blob = await put(unique, req.file.buffer, {
          access: 'public',
          contentType: req.file.mimetype,
        });
        return res.status(201).json({ imageUrl: blob.url });
      }

      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, unique), req.file.buffer);
      const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${unique}`;
      res.status(201).json({ imageUrl: fullUrl });
    } catch (uploadErr) {
      res.status(500).json({ message: `Image upload failed: ${uploadErr.message}` });
    }
  });
});

module.exports = router;
