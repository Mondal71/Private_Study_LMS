const Reservation = require("../models/Reservation");
const Library = require("../models/Library");
const fs = require("fs");
const path = require("path");


exports.bookSeat = async (req, res) => {
  const { libraryId, paymentMode, aadhar, phoneNumber } = req.body;

  try {
    const library = await Library.findById(libraryId);
    if (!library || library.availableSeats < 1) {
      return res.status(400).json({ error: "No seats available" });
    }

    // ✅ Handle image upload
    let photoPath = "";
    if (req.file && req.file.buffer) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const fullPath = path.join(__dirname, "..", "uploads", fileName);
      fs.writeFileSync(fullPath, req.file.buffer);
      photoPath = `/uploads/${fileName}`;
    }

    const expiresAt =
      paymentMode === "offline" ? new Date(Date.now() + 60 * 60 * 1000) : null;

    const reservation = new Reservation({
      userId: req.user._id,
      libraryId,
      aadhar,
      phoneNumber,
      photo: photoPath,
      paymentMode,
      isPaid: paymentMode === "online",
      status: "pending",
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

    // ✅ Update reservation
    reservation.status = "cancelled";

    // ✅ IF not confirmed yet, set custom message
    if (reservation.status !== "confirmed") {
      reservation.message = "Admission cancelled by user";
    }

    await reservation.save();

    // ✅ Refund seat only if it was already confirmed
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

// Get all reservations for libraries owned by current admin
exports.getReservationsForAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Get all libraries owned by this admin
    const libraries = await Library.find({ adminId });
    const libraryIds = libraries.map((lib) => lib._id);

    const reservations = await Reservation.find({ libraryId: { $in: libraryIds } })
      .populate("libraryId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ reservations });
  } catch (err) {
    console.error("Admin Reservations Error:", err.message);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

// Accept or Reject a reservation
exports.handleReservationDecision = async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  try {
    const reservation = await Reservation.findById(id).populate("libraryId");
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const library = reservation.libraryId;

    if (library.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (decision === "accept") {
      if (library.availableSeats > 0) {
        reservation.status = "confirmed";
        reservation.isPaid = true;
        reservation.message = "Admission done successfully"; // ✅ FIXED
        await reservation.save();

        library.availableSeats -= 1;
        await library.save();

        return res.json({ message: "Reservation accepted" });
      } else {
        reservation.status = "cancelled";
        reservation.message = "No seats available. Payment refunded."; // ✅ FIXED
        await reservation.save();

        return res
          .status(400)
          .json({ error: "No seats available, reservation cancelled" });
      }
    } else if (decision === "reject") {
      reservation.status = "cancelled";
      reservation.message = "Reservation rejected. Payment refunded."; // ✅ FIXED
      await reservation.save();

      return res.json({ message: "Reservation rejected" });
    } else {
      return res.status(400).json({ error: "Invalid decision" });
    }
  } catch (err) {
    console.error("Decision Error:", err.message);
    res.status(500).json({ error: "Failed to update reservation" });
  }
};


