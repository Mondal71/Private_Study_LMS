import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const { id: libraryId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    aadhar: "",
    phone: "",
    paymentMode: "offline",
    photo: null, // 📸 for upload
  });
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.aadhar || !form.phone || !form.paymentMode) {
      alert("Please fill all required fields.");
      return;
    }

    if (form.paymentMode === "offline") {
      return handleOfflineBooking(); // 🟡 use proper handler
    } else {
      return handleOnlinePayment(); // 🟢 use proper handler
    }
  };
  

  const handleOfflineBooking = async () => {
    if (!form.aadhar || !form.phone || !form.photo) {
      alert("Please fill all fields and upload photo.");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("libraryId", libraryId);
    formData.append("paymentMode", "offline");
    formData.append("aadhar", form.aadhar);
    formData.append("phoneNumber", form.phone);
    formData.append("photo", form.photo);

    try {
      const res = await API.post("/reservations/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Offline booking submitted! Please pay at the library.");
      navigate("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };
  

  const handleOnlinePayment = async () => {
    if (!form.aadhar || !form.phone || !form.photo) {
      alert("Please fill all fields and upload photo.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await API.post(
        "/payment/create-order",
        { amount: 500 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, key } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "PrepZone",
        description: "Library Seat Booking",
        order_id: order.id,
        handler: async function (response) {
          const formData = new FormData();
          formData.append("libraryId", libraryId);
          formData.append("paymentMode", "online");
          formData.append("aadhar", form.aadhar);
          formData.append("phoneNumber", form.phone);
          formData.append("photo", form.photo);
          formData.append("razorpay_order_id", response.razorpay_order_id);
          formData.append("razorpay_payment_id", response.razorpay_payment_id);
          formData.append("razorpay_signature", response.razorpay_signature);

          try {
            const confirm = await API.post("/reservations/book", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            alert("Online booking successful!");
            navigate("/user/dashboard");
          } catch (err) {
            console.error("Booking Error:", err);
            alert("Booking failed after payment.");
          }
        },
        theme: { color: "#6366F1" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Payment failed");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
            Book Your Seat
          </h2>
          <input
            name="aadhar"
            placeholder="Aadhar Number"
            value={form.aadhar}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input w-full mb-4"
          />

          <label className="block font-medium mb-2">Payment Mode:</label>
          <select
            name="paymentMode"
            value={form.paymentMode}
            onChange={handleChange}
            className="input w-full mb-6"
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            className="input w-full mb-4"
          />

          <button className="btn-primary w-full" onClick={handleSubmit}>
            Submit Booking
          </button>
        </div>
      </div>
    </>
  );
}
