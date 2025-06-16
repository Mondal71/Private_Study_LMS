const express = require("express");
const router = express.Router();
const {
  bookSeat,
  getMyReservations,
  cancelReservation,
} = require("../controllers/reservationController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ❌ REMOVE this duplicate line:
// router.post("/book", verifyToken, bookSeat);

// ✅ USE this one only (with photo upload support)
router.post("/book", verifyToken, upload.single("photo"), bookSeat);

router.get("/my", verifyToken, getMyReservations);
router.put("/:id/cancel", verifyToken, cancelReservation);

module.exports = router;
