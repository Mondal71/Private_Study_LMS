const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  login,
  setPassword,
} = require("../controllers/adminController");

router.post("/signup", sendOTP);
router.post("/verify", verifyOTP);
router.post("/set-password", setPassword); // 👈 NEW
router.post("/login", login);
 

module.exports = router;
