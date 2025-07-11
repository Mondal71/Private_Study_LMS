const express = require("express");
const router = express.Router();
const {
  bookSeat,
  getMyReservations,
  cancelReservation,
  getReservationsForAdmin,
  handleReservationDecision,
  getReservationsByLibrary,
} = require("../controllers/reservationController");
const { verifyToken } = require("../middleware/auth");

router.post("/book/:id", verifyToken, bookSeat);
router.get("/my", verifyToken, getMyReservations);
router.put("/:id/cancel", verifyToken, cancelReservation);
router.get("/admin/reservations", verifyToken, getReservationsForAdmin);
router.put(
  "/admin/reservations/:id/decision",
  verifyToken,
  handleReservationDecision
);
router.get("/library/:libraryId", verifyToken, getReservationsByLibrary);

module.exports = router;
