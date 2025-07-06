const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Debug: Print Razorpay env variables
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

connectDB();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
// Removed payment integration

const app = express();

//  CORS setup with frontend URL
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://private-study-lms-frontend.onrender.com"
      : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/razorpay", razorpayRoutes);
// Removed: app.use("/api/payment", paymentIntregation);

// Health check route
app.get("/", (req, res) => {
  res.send("PrepZone Server Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Background cron jobs
require("./cronJobs");
