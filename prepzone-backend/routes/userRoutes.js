const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, setPassword, login } = require("../controllers/userController");

router.post("/signup", sendOTP);
router.post("/verify", verifyOTP);
router.post("/set-password", setPassword);
router.post("/login", login);

module.exports = router;
