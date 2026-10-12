const express = require('express');
const router = express.Router();
const {
  simulatePayment,
  getPaymentHistory,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.use(protect);

router.post('/simulate', simulatePayment);
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentById);

module.exports = router;
