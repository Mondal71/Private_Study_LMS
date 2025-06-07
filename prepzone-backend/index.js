const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/reservations", reservationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("PrepZone Server Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});

// Start background cron jobs
require("./cronJobs"); // ⏱ Auto-cancel unpaid offline bookings
