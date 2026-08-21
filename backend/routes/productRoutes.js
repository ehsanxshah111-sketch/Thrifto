const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleSoldOut,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public - anyone browsing the store
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only - add / edit / change stock / mark sold out / delete
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.patch('/:id/sold-out', protect, adminOnly, toggleSoldOut);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
