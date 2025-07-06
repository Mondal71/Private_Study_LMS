const Reservation = require("../models/Reservation");
const Library = require("../models/Library");

//  Book a Seat
exports.bookSeat = async (req, res) => {
  const { aadhar, email, phoneNumber, paymentMode, duration, name, dob, price } = req.body;
  const libraryId = req.params.id;

  try {
    const library = await Library.findById(libraryId);
    if (!library || library.availableSeats < 1) {
      return res.status(400).json({ error: "No seats available" });
    }

    // Validate duration
    const validDurations = ["6hr", "12hr", "24hr"];
    if (!validDurations.includes(duration)) {
      return res.status(400).json({ error: "Invalid duration" });
    }

    //  Fix for accessing price
    let price;
    if (duration === "6hr") price = library.prices.sixHour;
    else if (duration === "12hr") price = library.prices.twelveHour;
    else if (duration === "24hr") price = library.prices.twentyFourHour;

    if (price === undefined || price === null) {
      return res
        .status(400)
        .json({ error: "Price not set for selected duration" });
    }

    const expiresAt =
      paymentMode === "offline" ? new Date(Date.now() + 60 * 60 * 1000) : null;

    const reservation = new Reservation({
      userId: req.user._id,
      libraryId,
      aadhar,
      email,
      phoneNumber,
      paymentMode,
      duration,
      price,
      isPaid: false,
      status: "pending",
      expiresAt,
      name,
      dob,
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Seat reserved",
      reservation,
    });
  } catch (error) {
    console.error("Book Seat Error:", error.message);
    res.status(500).json({ error: "Failed to book seat" });
  }
};


//  Get my reservations
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

//  Cancel reservation
exports.cancelReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const wasConfirmed = reservation.status === "confirmed";

    reservation.status = "cancelled";
    reservation.message = "Admission cancelled by user";
    await reservation.save();

    if (wasConfirmed) {
      const library = await Library.findById(reservation.libraryId);
      if (library) {
        library.availableSeats += 1;
        await library.save();
      }
    }

    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel Reservation Error:", error.message);
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
};


//  Auto cancel unpaid reservations (offline)
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
      reservation.status = "cancelled";
      await reservation.save();

      await Library.findByIdAndUpdate(reservation.libraryId, {
        $inc: { availableSeats: 1 },
      });

      console.log(`⛔ Auto-cancelled reservation ${reservation._id}`);
    }

    console.log(
      `Auto-cancel check completed at ${new Date().toLocaleString()}`
    );
  } catch (error) {
    console.error("Auto-cancel error:", error.message);
  }
};

//  Admin: Get all reservations for their libraries
exports.getReservationsForAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    const libraries = await Library.find({ adminId });
    const libraryIds = libraries.map((lib) => lib._id);

    const reservations = await Reservation.find({
      libraryId: { $in: libraryIds },
    })
      .populate("libraryId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ reservations });
  } catch (err) {
    console.error("Admin Reservations Error:", err.message);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

//  Admin: Accept or reject reservation
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
        reservation.message = "Admission done successfully";
        await reservation.save();

        library.availableSeats -= 1;
        await library.save();

        return res.json({ message: "Reservation accepted" });
      } else {
        reservation.status = "cancelled";
        reservation.message = "No seats available. Payment refunded.";
        await reservation.save();

        return res
          .status(400)
          .json({ error: "No seats available, reservation cancelled" });
      }
    } else if (decision === "reject") {
      if (reservation.status === "confirmed") {
        const library = await Library.findById(reservation.libraryId);
        library.availableSeats += 1;
        await library.save();
      }

      reservation.status = "cancelled";
      reservation.message = "Reservation rejected. Payment refunded.";
      reservation.isPaid = false;

      await reservation.save();

      return res.json({ message: "Reservation rejected" });
    }
  } catch (err) {
    console.error("Decision Error:", err.message);
    res.status(500).json({ error: "Failed to update reservation" });
  }
};
