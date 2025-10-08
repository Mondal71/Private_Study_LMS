const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// OTP generator
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
// NOTE: Ensure MAIL_USER and MAIL_PASS are correctly set in your environment (especially on Render).
// If using Gmail, MAIL_PASS MUST be an App Password, not your regular password.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // app password
  },
});

// Email sender
const sendEmailOTP = async (email, otp, name = "User") => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error(
      "Mail Error: MAIL_USER or MAIL_PASS environment variables are not set."
    );
    // Throwing a distinct error here helps confirm the environment variable issue
    throw new Error(
      "Mail service credentials missing. Check .env or Render secrets."
    );
  }

  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your PrepZone OTP",
      text: `Hi ${name}, your OTP for PrepZone verification is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    // --- CRUCIAL DEBUGGING STEP ---
    // Log the full error object from Nodemailer, which contains the specific code (e.g., 535-5.7.8 for Auth error)
    console.error("=================================================");
    console.error("Mail Sending Failed! Nodemailer Error Object:");
    console.error(err);
    console.error("=================================================");
    // Throwing a generic, descriptive error for the API response
    throw new Error(
      "Failed to connect to email service or send mail. See server logs for detailed Nodemailer error."
    );
  }
};

// Send OTP for signup
exports.sendOTP = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required" });

  try {
    const otp = generateOTP();
    let user = await User.findOne({ email });

    if (!user) {
      // New user flow
      user = new User({
        name,
        email,
        otp,
        otpCreatedAt: Date.now(),
        isVerified: false,
      });
    } else {
      // Existing user flow (resending OTP)
      if (user.password)
        return res
          .status(409)
          .json({
            error: "User already exists with a password. Please login.",
          });

      user.name = name;
      user.otp = otp;
      user.otpCreatedAt = Date.now();
      user.isVerified = false;
    }

    // --- STEP 1: Database Save ---
    await user.save();
    console.log(
      `[DEBUG] User ${user.email} saved successfully. Proceeding to email.`
    );
    // --- END STEP 1 ---

    // --- STEP 2: Email Send ---
    await sendEmailOTP(email, otp, name);
    // --- END STEP 2 ---

    return res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (err) {
    // This catch block handles Mongoose errors AND re-thrown email errors
    console.error("OTP Send Endpoint Error:", err.message);

    // Return the response with the captured error detail
    return res.status(500).json({
      error: "Failed to process signup or send verification email.",
      detail: err.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    // Check expiration (5 minutes)
    const isExpired =
      Date.now() - new Date(user.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired)
      return res.status(400).json({ error: "OTP expired. Request new one." });

    user.isVerified = true;
    user.otp = "";
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

// Set password
exports.setPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res
        .status(400)
        .json({ error: "OTP not verified or user not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    console.error("Set Password Error:", err.message);
    res.status(500).json({ error: "Failed to set password" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select(
      "email password _id role"
    );
    if (!user || !user.password)
      return res
        .status(400)
        .json({ error: "User not found or password not set" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// Forgot password - Send OTP
exports.sendForgotOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpCreatedAt = Date.now();
    await user.save();

    await sendEmailOTP(email, otp); // Name optional
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send Forgot OTP Error:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify forgot OTP
exports.verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    const isExpired =
      Date.now() - new Date(user.otpCreatedAt).getTime() > 5 * 60 * 1000;
    if (isExpired) return res.status(400).json({ error: "OTP expired" });

    // The user doesn't strictly need to be marked as verified here,
    // but the original code did it, so we keep it.
    user.isVerified = true;
    user.otp = "";
    await user.save();
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify Forgot OTP Error:", err.message);
    res.status(500).json({ error: "OTP verification failed" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ error: "Password reset failed" });
  }
};
