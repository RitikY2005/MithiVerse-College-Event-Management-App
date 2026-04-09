const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router=express.Router();


router.post('/create-order',protect,authorize('user'),createOrder);
router.post('/verify-payment',protect,authorize('user'),verifyPayment);



module.exports = router;