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
