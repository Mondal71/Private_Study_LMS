const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");

const app = express();

// FIXED: Add deployed frontend domain
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://private-study-lms-frontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.get("/", (req, res) => {
  res.send("PrepZone Server Running");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

require("./cronJobs");
