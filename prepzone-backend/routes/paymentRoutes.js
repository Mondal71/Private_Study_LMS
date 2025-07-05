const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  refundPayment,
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/refund", refundPayment);

module.exports = router;
