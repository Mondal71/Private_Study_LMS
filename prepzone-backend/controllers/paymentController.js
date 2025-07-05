// ✅ paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Reservation = require("../models/Reservation");
const Library = require("../models/Library");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Order creation failed",
        error: err.message,
      });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    reservationDetails,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Signature mismatch" });
  }

  try {
    const { aadhar, email, phoneNumber, paymentMode, duration, libraryId } =
      reservationDetails;

    const library = await Library.findById(libraryId);
    if (!library)
      return res
        .status(404)
        .json({ success: false, message: "Library not found" });

    if (library.availableSeats < 1) {
      return res.status(409).json({
        success: false,
        message: "Seat not available. Initiating refund...",
        refundRequired: true,
      });
    }

    const reservation = await Reservation.create({
      aadhar,
      email,
      phoneNumber,
      paymentMode: "online",
      duration,
      user: req.user.id,
      libraryId,
      isPaid: true,
      status: "confirmed",
    });

    library.availableSeats -= 1;
    await library.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and seat booked ✅",
      reservation,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

exports.refundPayment = async (req, res) => {
  const { paymentId } = req.body;

  try {
    const refund = await razorpay.payments.refund(paymentId, {
      speed: "optimum", // or "instant" if enabled on your account
    });

    res.json({
      success: true,
      message: "Refund initiated successfully",
      refund,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Refund failed",
      error: error.message,
    });
  }
};

