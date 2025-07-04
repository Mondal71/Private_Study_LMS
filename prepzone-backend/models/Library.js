const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  amenities: [String],
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  prices: {
    sixHour: {
      type: Number,
      required:false,
    },
    twelveHour: {
      type: Number,
      required:false,
    },
    twentyFourHour: {
      type: Number,
      required:false,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Library", librarySchema);
