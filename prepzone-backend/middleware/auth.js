const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // ✅ Decode se user nikala
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user; // ✅ ✅ ✅ This line is MUST!
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
