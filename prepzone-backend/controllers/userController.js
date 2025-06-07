const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  exports.sendOTP = async (req, res) => {
    const { name, phone } = req.body;

    try {
      if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone are required" });
      }

      let user = await User.findOne({ phone });

      const otp = generateOTP();

      if (!user) {
        user = new User({ name, phone, otp });
      } else {
        user.otp = otp;
        user.name = name;
      }

      await user.save();

      console.log(`OTP for ${phone} is: ${otp}`);

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("OTP Send Error:", error.message);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  };
  
  exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    try {
      const user = await User.findOne({ phone });

      if (!user || user.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      user.isVerified = true;
      user.otp = "";
      await user.save();

      res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
      res.status(500).json({ error: "OTP verification failed" });
    }
};
  
// Set password after OTP verification
exports.setPassword = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user || !user.isVerified) {
      return res.status(400).json({ error: "OTP not verified or user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Set Password Error:", error);
    res.status(500).json({ error: "Failed to set password" });
  }
};

// Login
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user || !user.password) {
      return res.status(400).json({ error: "User not found or password not set" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
