const express = require("express");
const router = express.Router();
const { createOrder, paymentSuccess } = require("../controllers/razorpayController");

router.post("/create-order", createOrder);
router.post("/payment-success", paymentSuccess);

module.exports = router; 