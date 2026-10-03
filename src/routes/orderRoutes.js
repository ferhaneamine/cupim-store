const express = require('express');
const router = express.Router();

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

const protect = require('../middleware/authMiddleware');
const admin   = require('../middleware/adminMiddleware');

// Public — anyone can place an order
router.post('/', createOrder);

// Admin only
router.get('/',         protect, admin, getOrders);
router.get('/:id',      protect, admin, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
