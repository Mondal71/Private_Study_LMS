const express = require("express");
const router = express.Router();
const {
  bookSeat,
  getMyReservations,
  cancelReservation,
} = require("../controllers/reservationController");
const { verifyToken } = require("../middleware/auth");

router.post("/book", verifyToken, bookSeat);
router.get("/my", verifyToken, getMyReservations);
router.put("/:id/cancel", verifyToken, cancelReservation);

module.exports = router;

