const express = require('express');
const router = express.Router();
const {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  toggleActive,
  deletePromotion,
} = require('../controllers/promotionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public - what the storefront's homepage reads
router.get('/', getActivePromotions);

// Admin only - manage every promotion, including scheduled/inactive ones
router.get('/all', protect, adminOnly, getAllPromotions);
router.post('/', protect, adminOnly, createPromotion);
router.put('/:id', protect, adminOnly, updatePromotion);
router.patch('/:id/toggle', protect, adminOnly, toggleActive);
router.delete('/:id', protect, adminOnly, deletePromotion);

module.exports = router;
