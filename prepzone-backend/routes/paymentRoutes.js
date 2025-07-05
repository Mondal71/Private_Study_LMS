const express = require("express");
const router = express.Router();
const {
  createCashfreeOrder,
  bookLibraryAfterPayment,
  refundPayment,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/auth");

//  Create a payment order (Cashfree)
router.post("/cashfree/create-order", verifyToken, createCashfreeOrder);

//  Confirm booking after payment success
router.post("/cashfree/verify-payment", verifyToken, bookLibraryAfterPayment);

//  Refund if needed
router.post("/cashfree/refund", verifyToken, refundPayment);

module.exports = router;
