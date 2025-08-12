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

// Add index for login optimization (removed duplicate)
userSchema.index({ email: 1 });

// Add lean() optimization for read-only queries
userSchema.set('toJSON', { virtuals: false });
userSchema.set('toObject', { virtuals: false });

module.exports = mongoose.model("User", userSchema);
