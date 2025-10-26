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

// CORS Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://private-study-lms-frontend.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight OPTIONS Request Handling
app.options("*", cors());

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.disable("x-powered-by");

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.get("/", (req, res) => {
  res.send("PrepZone Server Running");
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server started on port ${PORT}`));

require("./cronJobs");
