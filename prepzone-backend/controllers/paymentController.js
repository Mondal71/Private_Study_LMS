const axios = require("axios");
const Reservation = require("../models/Reservation");
const Library = require("../models/Library");

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { amount, email, phone, name } = req.body;
    console.log("Received payment request with:", {
      amount,
      email,
      phone,
      name,
    });

    // Debug environment variables
    console.log("Cashfree Config Check:", {
      appId: process.env.CASHFREE_APP_ID ? "Set" : "Not Set",
      secretKey: process.env.CASHFREE_SECRET_KEY ? "Set" : "Not Set",
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Cashfree credentials not configured. Please check environment variables.",
      });
    } 

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_email: email,
          customer_phone: phone,
          customer_name: name,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    res.status(200).json({
      success: true,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (err) {
    console.error("Cashfree Order Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Cashfree order creation failed",
    });
  }
};

// After successful payment (from onSuccess), confirm and reserve seat
exports.bookLibraryAfterPayment = async (req, res) => {
  try {
    const { aadhar, email, phoneNumber, paymentMode, duration, libraryId } =
      req.body;

    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: "Library not found",
      });
    }

    if (library.availableSeats < 1) {
      return res.status(409).json({
        success: false,
        message: "No seats available. Please try another time.",
      });
    }

    const existing = await Reservation.findOne({
      user: req.user.id,
      libraryId,
      isPaid: true,
      duration,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a paid reservation for this duration.",
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
      message: "Seat successfully booked after payment ✅",
      reservation,
    });
  } catch (err) {
    console.error("Booking error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
exports.refundPayment = async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.post(
      `https://sandbox.cashfree.com/pg/orders/${paymentId}/refunds`,
      {
        refund_amount: 100, //  Replace this with actual amount if needed
        refund_id: "refund_" + Date.now(),
        refund_note: "Library seat unavailable or user cancelled.",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      refund: response.data,
    });
  } catch (err) {
    console.error("Refund Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Refund initiation failed",
      error: err.message,
    });
  }
};
