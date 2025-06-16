const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // ✅ Send key to frontend
    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({
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
    reservationId,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }

    reservation.isPaid = true;
    reservation.status = "confirmed";
    await reservation.save();

    await Library.findByIdAndUpdate(reservation.libraryId, {
      $inc: { availableSeats: -1 },
    });

    return res.json({
      success: true,
      message: "Payment verified & reservation confirmed ✅",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Reservation update failed",
      error: err.message,
    });
  }
};