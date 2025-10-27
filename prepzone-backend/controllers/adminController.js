const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
const { Resend } = require("resend");


// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender
const sendEmailOTP = async (email, otp, name = "User") => {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in .env");
    throw new Error("Email service not configured");
  }

  try {
    const response = await resend.emails.send({
      from: "PrepZone <onboarding@resend.dev>",
      to: "mondalasp123@gmail.com",
      subject: "Your PrepZone OTP",
      html: `<p>Hi <b>${name}</b>,</p>
             <p>Your OTP for PrepZone verification is:</p>
             <h2>${otp}</h2>
             <p>This OTP will expire in 5 minutes.</p>`,
    });

    console.log("Email sent via Resend:", response);
  } catch (err) {
    console.error("=================================================");
    console.error("Email sending failed:", err);
    console.error("=================================================");
    throw new Error("Failed to send email using Resend API");
  }
};


// SEND OTP 
exports.sendOTP = async (req, res) => {
  const { name, email } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    const otp = generateOTP();

    if (!admin) {
      // FIXED: Include otpCreatedAt here
      admin = new Admin({ name, email, otp, otpCreatedAt: Date.now() });
    } else {
      // Check if admin already has a password (already registered)
      if (admin.password) {
        return res.status(409).json({ error: "Admin already exists. Please login instead." });
      }
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

//  VERIFY OTP 
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    // Check if OTP matches latest one
    if (!admin.otp || admin.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP expired (5 mins)
    const isExpired =
      Date.now() - new Date(admin.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    // All OK: Mark verified, clear OTP and timestamp
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
//  SET PASSWORD
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

//  LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const startTime = Date.now();

  try {
    // Optimize: Only select needed fields for login
    const dbStart = Date.now();
    const admin = await Admin.findOne({ email }).select('email password _id name');
    const dbTime = Date.now() - dbStart;

    if (!admin || !admin.password) {
      return res
        .status(401)
        .json({ error: "Admin not found or password not set" });
    }

    const bcryptStart = Date.now();
    const isMatch = await bcrypt.compare(password, admin.password);
    const bcryptTime = Date.now() - bcryptStart;
    
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

    const totalTime = Date.now() - startTime;
    
    // Log performance metrics only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Admin Login Performance - DB: ${dbTime}ms, Bcrypt: ${bcryptTime}ms, Total: ${totalTime}ms`);
    }

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

//  FORGOT PASSWORD - Send OTP
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

// FORGOT PASSWORD - Verify OTP
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

// FORGOT PASSWORD - Reset Password
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

