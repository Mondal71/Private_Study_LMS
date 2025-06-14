const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  exports.sendOTP = async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required" });
    }

    try {
      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      let user = await User.findOne({ phone });

      if (!user) {
        user = new User({ name, phone, otp, isVerified: false });
      } else {
        user.name = name;
        user.otp = otp;
        user.isVerified = false;
      }

      const savedUser = await user.save();
      console.log("User saved with OTP:", savedUser);

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("OTP Send Error:", err.message);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  };

  // Verify OTP
  exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    console.log("Verifying OTP for:", phone, otp);

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    try {
      const user = await User.findOne({ phone });

      if (!user) {
        console.log("User not found");
        return res.status(400).json({ error: "User not found" });
      }

      console.log("OTP in DB:", user.otp);
      if (!user.otp || user.otp.toString() !== otp.toString()) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      user.isVerified = true;
      user.otp = "";
      await user.save();

      return res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
      console.error("Verify OTP Error:", err.message);
      return res.status(500).json({ error: "OTP verification failed" });
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
