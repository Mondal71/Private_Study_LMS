import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const [aadhar, setAadhar] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const [duration, setDuration] = useState("6hr");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  // ✅ Load Cashfree SDK once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.cashfree.com/js/ui/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ Cashfree SDK loaded");
      setSdkReady(true);
    };
    script.onerror = () => {
      alert("❌ Cashfree SDK failed to load");
    };
    document.body.appendChild(script);
  }, []);

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    if (aadhar.length !== 12) return alert("Aadhar must be 12 digits");
    if (!email.includes("@")) return alert("Enter valid email");
    if (phone.length < 10) return alert("Enter valid phone number");

    setLoading(true);

    if (paymentMode === "offline") {
      try {
        await API.post(
          `/reservations/book/${id}`,
          { aadhar, email, phoneNumber: phone, paymentMode, duration },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Booking successful!");
        navigate("/user/my-bookings");
      } catch (err) {
        alert(err.response?.data?.error || "Booking failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const libRes = await API.get(`/libraries/all`, {
        headers: { Authorization: `Bearer ${token}` },
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

      if (!amount) return alert("Invalid pricing or duration");

      const orderRes = await API.post(
        "/payment/cashfree/create-order",
        { amount, email, phone, name: "PrepZone User" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { paymentSessionId } = orderRes.data;

      if (!sdkReady || !window.Cashfree) {
        alert("❌ Cashfree SDK not ready");
        return;
      }

      window.Cashfree.initDropin({
        paymentSessionId,
        redirect: false,
        container: "cashfree-dropin",
        style: {
          backgroundColor: "#f9fafb",
          color: "#1e293b",
        },
        onSuccess: async () => {
          alert("✅ Payment successful");
          await API.post(
            `/reservations/book/${id}`,
            {
              aadhar,
              email,
              phoneNumber: phone,
              paymentMode: "online",
              duration,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          navigate("/user/my-bookings");
        },
        onFailure: () => {
          alert("❌ Payment failed");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment");
    } finally {
      setLoading(false);
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
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input w-full mb-4"
          >
            <option value="6hr">6 Hours</option>
            <option value="12hr">12 Hours</option>
            <option value="24hr">24 Hours</option>
          </select>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="input w-full mb-6"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-sm mb-6">
            <strong>Note:</strong> Bring Aadhar, photocopy & passport-size
            photo.
          </div>

          <button
            onClick={handleBook}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Book Now"}
          </button>

          <div id="cashfree-dropin" className="mt-6" />
        </div>
      </div>
    </>
  );
}
