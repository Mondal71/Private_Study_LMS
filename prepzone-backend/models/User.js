const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  otpCreatedAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // The password field is optional initially, which is correct for an OTP-based signup flow.
  password: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Add index for login optimization
userSchema.index({ email: 1 });

// Ensure fields like otp/otpCreatedAt are included when converting to JSON/Object
userSchema.set("toJSON", { virtuals: false });
userSchema.set("toObject", { virtuals: false });

module.exports = mongoose.model("User", userSchema);
