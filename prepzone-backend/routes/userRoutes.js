const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  setPassword,
  login,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
} = require("../controllers/userController");

// The client is hitting the /api/user/signup endpoint,
// which corresponds to the sendOTP controller function.
router.post("/signup", sendOTP);
router.post("/verify", verifyOTP);
router.post("/set-password", setPassword);
router.post("/login", login);

router.post("/forgot/send-otp", sendForgotOTP);
router.post("/forgot/verify-otp", verifyForgotOTP);
router.post("/forgot/reset-password", resetPassword);

module.exports = router;
