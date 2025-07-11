require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    console.log("Order request received:", req.body); //  log request

    const { amount, currency = "INR" } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order); // log order

    res.json({ success: true, order });
  } catch (err) {
    console.error("Order creation failed:", err); // log error
    res.status(500).json({ success: false, error: err.message });
  }
};

// Payment success handler
exports.paymentSuccess = async (req, res) => {
  try {
    const { reservationId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    // TODO: Optionally verify signature here for extra security

    const reservation = await require("../models/Reservation").findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, error: "Reservation not found" });
    }
    if (reservation.isPaid && reservation.status === "confirmed") {
      return res.json({ success: true, message: "Already confirmed" });
    }

    // Mark as paid and confirmed
    reservation.isPaid = true;
    reservation.status = "confirmed";
    reservation.message = "Admission successful (online payment)";
    // Decrement seat if not already done
    if (!reservation.seatTaken) {
      const Library = require("../models/Library");
      const library = await Library.findById(reservation.libraryId);
      if (library && library.availableSeats > 0) {
        library.availableSeats -= 1;
        await library.save();
        reservation.seatTaken = true;
      }
    }
    await reservation.save();
    res.json({ success: true, message: "Payment successful, admission confirmed", reservation });
  } catch (err) {
    console.error("Payment success error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
