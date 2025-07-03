const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// ✅ Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP to email
const sendEmailOTP = async (email, otp) => {
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
    subject: "Your OTP for Admin Signup",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// =================== SEND OTP ===================
exports.sendOTP = async (req, res) => {
  const { name, email } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    const otp = generateOTP();

    if (!admin) {
      // ✅ FIXED: Include otpCreatedAt here
      admin = new Admin({ name, email, otp, otpCreatedAt: Date.now() });
    } else {
      admin.otp = otp;
      admin.otpCreatedAt = Date.now();
      admin.name = name;
    }

    await admin.save();

    await sendEmailOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// =================== VERIFY OTP ===================
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    // ✅ Check if OTP matches latest one
    if (!admin.otp || admin.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ Check if OTP expired (5 mins)
    const isExpired =
      Date.now() - new Date(admin.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    // ✅ All OK: Mark verified, clear OTP and timestamp
    admin.isVerified = true;
    admin.otp = "";
    admin.otpCreatedAt = null;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
// =================== SET PASSWORD ===================
exports.setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isVerified) {
      return res
        .status(400)
        .json({ error: "Admin not verified or does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Set Password Error:", error);
    res.status(500).json({ error: "Failed to set password" });
  }
};

// =================== LOGIN ===================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.password) {
      return res
        .status(401)
        .json({ error: "Admin not found or password not set" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
      role: "admin",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// =================== FORGOT PASSWORD - Send OTP ===================
exports.sendForgotOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpCreatedAt = Date.now();
    await admin.save();

    await sendEmailOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot Password - Send OTP Error:", error.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// =================== FORGOT PASSWORD - Verify OTP ===================
exports.verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const isExpired =
      Date.now() - new Date(admin.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return res.status(400).json({ error: "OTP expired. Try again." });
    }

    admin.otp = "";
    await admin.save();

    res.status(200).json({ message: "OTP verified. You can now reset password." });
  } catch (error) {
    console.error("Forgot Password - Verify OTP Error:", error.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

// =================== FORGOT PASSWORD - Reset Password ===================
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

