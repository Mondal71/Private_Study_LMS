const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// OTP generator
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Email sender without separate utils file
const sendEmailOTP = async (email, otp, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your PrepZone OTP",
      text: `Hi ${name}, your OTP for PrepZone verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Mail Error:", err);
    throw new Error("Mail sending failed");
  }
};


// Send OTP
exports.sendOTP = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const otp = generateOTP();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, otp, isVerified: false });
    } else {
      // Check if user already has a password (already registered)
      if (user.password) {
        return res.status(409).json({ error: "User already exists. Please login instead." });
      }
      user.name = name;
      user.otp = otp;
      user.otpCreatedAt = Date.now();
      user.isVerified = false;
    }

    await user.save();
    await sendEmailOTP(email, otp, name);

    return res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.error("OTP Send Error:", err.message);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

//  Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP expired (5 minutes = 5 * 60 * 1000 ms)
    const isExpired =
      Date.now() - new Date(user.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
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

// Set Password
exports.setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ error: "OTP not verified or user not found" });
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

//  Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const startTime = Date.now();

  try {
    // Optimize: Only select needed fields for login
    const dbStart = Date.now();
    const user = await User.findOne({ email }).select('email password _id role');
    const dbTime = Date.now() - dbStart;

    if (!user || !user.password) {
      return res
        .status(400)
        .json({ error: "User not found or password not set" });
    }

    const bcryptStart = Date.now();
    const isMatch = await bcrypt.compare(password, user.password);
    const bcryptTime = Date.now() - bcryptStart;
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const totalTime = Date.now() - startTime;
    
    // Log performance metrics only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Login Performance - DB: ${dbTime}ms, Bcrypt: ${bcryptTime}ms, Total: ${totalTime}ms`);
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Step 1: Send OTP for forgot password
exports.sendForgotOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpCreatedAt = Date.now();
    await user.save();

    await sendEmailOTP(email, otp); //  already defined
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send Forgot OTP Error:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Step 2: Verify OTP
exports.verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const isExpired = Date.now() - new Date(user.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) return res.status(400).json({ error: "OTP expired" });

    user.isVerified = true; // ✅ optional
    user.otp = "";
    await user.save();
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify Forgot OTP Error:", err.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Password reset failed" });
  }
};


