const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//set pass
exports.setPassword = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const admin = await Admin.findOne({ phone });

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
    res.status(500).json({ error: "Failed to set password" });
  }
};
// Send OTP
exports.sendOTP = async (req, res) => {
  const { name, phone } = req.body;

  try {
    let admin = await Admin.findOne({ phone });

    const otp = generateOTP();

    if (!admin) {
      admin = new Admin({ name, phone, otp });
    } else {
      admin.otp = otp;
    }

    await admin.save();

    console.log("OTP for Admin", phone, "is:", otp);

    res.status(200).json({ message: "OTP sent to admin successfully" });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const admin = await Admin.findOne({ phone });

    if (!admin || admin.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    admin.isVerified = true;
    admin.otp = "";
    await admin.save();

    res.status(200).json({ message: "Admin verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const admin = await Admin.findOne({ phone });

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
      phone: admin.phone,
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
        phone: admin.phone,
        role: "admin",
      },
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};
