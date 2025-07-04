const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id || decoded.adminId); 
    } else {
      user = await User.findById(decoded.id || decoded.userId); 
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
