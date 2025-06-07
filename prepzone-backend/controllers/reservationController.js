const Reservation = require("../models/Reservation");
const Library = require("../models/Library");

exports.bookSeat = async (req, res) => {
  const { libraryId, paymentMode } = req.body;

  try {
    const library = await Library.findById(libraryId);
    if (!library || library.availableSeats < 1) {
      return res.status(400).json({ error: "No seats available" });
    }

    const expiresAt =
      paymentMode === "offline"
        ? new Date(Date.now() + 60 * 60 * 1000) // 1 hour later
        : null;

    const reservation = new Reservation({
      userId: req.user._id,
      libraryId,
      paymentMode,
      isPaid: paymentMode === "online", // default false for offline
      status: paymentMode === "online" ? "confirmed" : "pending",
      expiresAt,
    });

    await reservation.save();

    if (paymentMode === "online") {
      library.availableSeats -= 1;
      await library.save();
    }

    res.status(201).json({ message: "Seat reserved", reservation });
  } catch (error) {
    console.error("Book Seat Error:", error.message);
    res.status(500).json({ error: "Failed to book seat" });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate("libraryId", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Get Reservations Error:", error.message);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

exports.cancelReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ error: "Reservation already cancelled" });
    }

    // Update reservation
    reservation.status = "cancelled";
    await reservation.save();

    // Update library seats only if it was confirmed
    if (reservation.status === "confirmed") {
      const library = await Library.findById(reservation.libraryId);
      library.availableSeats += 1;
      await library.save();
    }

    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel Reservation Error:", error.message);
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
};

exports.autoCancelUnpaidReservations = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const reservations = await Reservation.find({
      paymentMode: "offline",
      isPaid: false,
      createdAt: { $lt: oneHourAgo },
      status: "active",
    });

    for (const reservation of reservations) {
      // Cancel reservation
      reservation.status = "cancelled";
      await reservation.save();

      // Free up seat in the library
      await Library.findByIdAndUpdate(reservation.libraryId, {
        $inc: { availableSeats: 1 },
      });

      console.log(`⛔ Auto-cancelled reservation ${reservation._id}`);
    }

    console.log(
      `✅ Auto-cancel check completed at ${new Date().toLocaleString()}`
    );
  } catch (error) {
    console.error("Auto-cancel error:", error.message);
  }
};