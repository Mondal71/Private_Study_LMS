// BookLibrary.jsx (Final Razorpay Integration Version)

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const [aadhar, setAadhar] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [duration, setDuration] = useState("6hr");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBook = async () => {
    if (aadhar.length !== 12) {
      alert("Aadhar number must be 12 digits");
      return;
    }

    if (paymentMode === "offline") {
      try {
        const res = await API.post(
          `/reservations/book/${id}`,
          { aadhar, email, phoneNumber: phone, paymentMode, duration },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("Booking successful!");
        navigate("/user/my-bookings");
      } catch (err) {
        alert(err.response?.data?.error || "Booking failed");
      }
      return;
    }

    try {
      const libRes = await API.get(`/libraries/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const selectedLibrary = libRes.data.libraries.find(
        (lib) => lib._id === id
      );
      const amount =
        duration === "6hr"
          ? selectedLibrary.prices.sixHour
          : duration === "12hr"
          ? selectedLibrary.prices.twelveHour
          : selectedLibrary.prices.twentyFourHour;

      if (!amount) {
        alert("Invalid pricing or duration.");
        return;
      }

      const orderRes = await API.post("/payment/create-order", { amount });
      const { key, order } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "PrepZone",
        description: "Library Seat Booking",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post(
              "/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                reservationDetails: {
                  libraryId: id,
                  aadhar,
                  email,
                  phoneNumber: phone,
                  paymentMode: "online",
                  duration,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyRes.data.success) {
              alert(
                verifyRes.data.message || "Payment & Booking successful ✅"
              );
              navigate("/user/my-bookings");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert(err.response?.data?.message || "Booking/payment failed");
          }
        },
        prefill: {
          name: "PrepZone User",
          email,
          contact: phone,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
            Book Your Seat
          </h2>

          <input
            type="text"
            placeholder="Aadhar Number"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input w-full mb-4"
          />

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input w-full"
            >
              <option value="6hr">6 Hours</option>
              <option value="12hr">12 Hours</option>
              <option value="24hr">24 Hours</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="input w-full"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-sm mb-6">
            <strong>Note:</strong> Please bring your original{" "}
            <strong>Aadhar card</strong>, a<strong> photocopy</strong>, and a{" "}
            <strong>passport-size photo</strong> when visiting.
          </div>

          <button onClick={handleBook} className="btn-primary w-full">
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
