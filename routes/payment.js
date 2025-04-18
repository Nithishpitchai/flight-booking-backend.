const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-payment', createPaymentIntent);

module.exports = router;
