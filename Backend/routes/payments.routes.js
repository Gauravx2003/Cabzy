const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-order', authMiddleware.userAuth, paymentController.createPaymentOrder);
router.post('/verify', authMiddleware.userAuth, paymentController.verifyPayment);

module.exports = router;