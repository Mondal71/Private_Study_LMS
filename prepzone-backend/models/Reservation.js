const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Library",
    required: true,
  },
  aadhar: String,
  phoneNumber: String,
  email: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  paymentMode: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: String,
    enum: ["6hr", "12hr", "24hr"],
    required: false,
    default: "6hr",
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
  message: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String, // Store as string (YYYY-MM-DD) for simplicity
    required: true,
  },
  seatTaken: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
