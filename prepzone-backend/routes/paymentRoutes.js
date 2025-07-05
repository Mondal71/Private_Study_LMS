const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  refundPayment,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

//  Create a payment order (Cashfree)
router.post("/cashfree/create-order", authMiddleware, createOrder);

//  Verify payment after success
router.post("/cashfree/verify-payment", authMiddleware, verifyPayment);

//  Refund payment if something goes wrong
router.post("/cashfree/refund", authMiddleware, refundPayment);

module.exports = router;
