import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const [aadhar, setAadhar] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [duration, setDuration] = useState("6hr");
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [library, setLibrary] = useState(null);
  const [prices, setPrices] = useState({ sixHour: 0, twelveHour: 0, twentyFourHour: 0 });
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch library details by ID
    API.get(`/libraries/${id}`)
      .then((res) => {
        setLibrary(res.data.library);
        setPrices(res.data.library.prices || {});
        // Set default duration to first available plan
        if (res.data.library.prices.sixHour) setDuration("6hr");
        else if (res.data.library.prices.twelveHour) setDuration("12hr");
        else if (res.data.library.prices.twentyFourHour) setDuration("24hr");
      })
      .catch(() => {
        alert("Failed to load library details");
      });
  }, [id]);

  const getPrice = () => {
    if (duration === "6hr") return prices.sixHour;
    if (duration === "12hr") return prices.twelveHour;
    if (duration === "24hr") return prices.twentyFourHour;
    return 0;
  };

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    if (aadhar.length !== 12) return alert("Aadhar must be 12 digits");
    if (!email.includes("@")) return alert("Enter valid email");
    if (phone.length < 10) return alert("Enter valid phone number");
    if (!name.trim()) return alert("Name is required");
    if (!dob) return alert("Date of Birth is required");
    setLoading(true);
    try {
      await API.post(
        `/reservations/book/${id}`,
        { aadhar, email, phoneNumber: phone, paymentMode: "offline", duration, price: getPrice(), name, dob }
      );
      alert("Booking successful!");
      navigate("/user/my-bookings");
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOnline = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    if (aadhar.length !== 12) return alert("Aadhar must be 12 digits");
    if (!email.includes("@")) return alert("Enter valid email");
    if (phone.length < 10) return alert("Enter valid phone number");
    if (!name.trim()) return alert("Name is required");
    if (!dob) return alert("Date of Birth is required");
    setPayLoading(true);
    try {
      const amount = getPrice();
      if (!amount) return alert("Invalid plan or price");
      const { data } = await API.post("/razorpay/create-order", { amount });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: library?.name || "PrepZone",
        description: `Library Booking Payment - ${duration}`,
        handler: async function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          // Book the seat as paid
          try {
            await API.post(
              `/reservations/book/${id}`,
              { aadhar, email, phoneNumber: phone, paymentMode: "online", duration, price: getPrice(), name, dob }
            );
            navigate("/user/my-bookings");
          } catch (err) {
            alert("Payment succeeded but booking failed. Contact support.");
          }
        },
        prefill: {
          email,
          contact: phone,
        },
        theme: { color: "#6366f1" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to initiate payment");
    } finally {
      setPayLoading(false);
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
          {library && (
            <div className="mb-4 text-center">
              <div className="font-semibold text-lg mb-2">{library.name}</div>
              <div className="text-gray-500 text-sm mb-1">{library.location}</div>
              <div className="text-gray-600 text-xs mb-2">{library.address}</div>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {Object.entries(prices).map(([key, value]) =>
                  value ? (
                    <span key={key} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {key === "sixHour" && "6hr"}
                      {key === "twelveHour" && "12hr"}
                      {key === "twentyFourHour" && "24hr"}
                      : ₹{value}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          )}
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
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input w-full mb-4"
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input w-full mb-4"
          >
            {prices.sixHour ? <option value="6hr">6 Hours (₹{prices.sixHour})</option> : null}
            {prices.twelveHour ? <option value="12hr">12 Hours (₹{prices.twelveHour})</option> : null}
            {prices.twentyFourHour ? <option value="24hr">24 Hours (₹{prices.twentyFourHour})</option> : null}
          </select>

          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-sm mb-6">
            <strong>Note:</strong> Bring Aadhar, photocopy & passport-size
            photo.
          </div>

          <button
            onClick={handleBook}
            className="btn-primary w-full mb-3"
            disabled={loading}
          >
            {loading ? "Processing..." : `Book Offline (₹${getPrice()})`}
          </button>

          <button
            onClick={handlePayOnline}
            className="btn-primary w-full bg-green-600 hover:bg-green-700"
            disabled={payLoading}
          >
            {payLoading ? "Processing..." : `Pay Online (₹${getPrice()})`}
          </button>
        </div>
      </div>
    </>
  );
}
