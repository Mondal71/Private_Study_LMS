const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  login,
  setPassword,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
} = require("../controllers/adminController");

router.post("/signup", sendOTP);
router.post("/verify", verifyOTP);
router.post("/set-password", setPassword); 
router.post("/login", login);
 
router.post("/forgot/send-otp", sendForgotOTP);
router.post("/forgot/verify-otp", verifyForgotOTP);
router.post("/forgot/reset-password", resetPassword);

module.exports = router;
