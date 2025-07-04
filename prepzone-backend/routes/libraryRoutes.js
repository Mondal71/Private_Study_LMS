const express = require("express");
const router = express.Router();

const {
  createLibrary,
  getMyLibraries,
  updateLibrary,
  deleteLibrary,
  getAllLibraries,
} = require("../controllers/libraryController");

const { verifyToken } = require("../middleware/auth");

//  Public Route
router.get("/all", getAllLibraries);

//  Admin Routes
router.post("/admin/library", verifyToken, createLibrary);
router.get("/admin/my-libraries", verifyToken, getMyLibraries);
router.put("/admin/library/:id", verifyToken, updateLibrary);
router.delete("/admin/library/:id", verifyToken, deleteLibrary);

module.exports = router;
