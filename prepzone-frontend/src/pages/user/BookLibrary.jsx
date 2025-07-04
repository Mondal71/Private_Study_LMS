import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const [aadhar, setAadhar] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [duration, setDuration] = useState("6hr"); // Default duration
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBook = async () => {
    if (aadhar.length !== 12) {
      alert("Aadhar number must be 12 digits");
      return;
    }

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

      if (res.data.success) {
        alert("Booking successful!");
        navigate("/user/my-bookings");
      } else {
        alert(res.data.error || "Booking failed");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
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

          {/* Duration Selection */}
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
            <strong>Aadhar card</strong>, an aadhar card <strong>photo copy</strong>, and a{" "}
            <strong>passport-size photo</strong> with you when visiting the
            library.
          </div>

          <button onClick={handleBook} className="btn-primary w-full">
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
