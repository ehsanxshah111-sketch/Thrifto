const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route  POST /api/upload
// @desc   Admin only - upload a product photo. Returns the URL to store on
//         the product's "image" field.
router.post('/', protect, adminOnly, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl: fullUrl });
  });
});

module.exports = router;
