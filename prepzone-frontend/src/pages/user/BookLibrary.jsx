import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function BookLibrary() {
  const { libraryId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    aadhar: "",
    phone: "",
    paymentMode: "online",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    if (!form.aadhar || !form.phone || !form.photo) {
      alert("Please fill all required fields and upload a photo.");
      return;
    }

    if (!/^\d{12}$/.test(form.aadhar)) {
      alert("Aadhar number must be 12 digits.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("libraryId", libraryId);
    formData.append("paymentMode", form.paymentMode);
    formData.append("aadhar", form.aadhar);
    formData.append("phoneNumber", form.phone);
    formData.append("photo", form.photo);

    try {
      await API.post("/reservations/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Booking submitted! You can check status in My Bookings.");
      navigate("/user/my-bookings");
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[85vh] flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Book Your Seat
          </h2>

          <input
            type="text"
            name="aadhar"
            placeholder="Aadhar Number"
            value={form.aadhar}
            onChange={handleChange}
            className="input w-full mb-4"
            maxLength={12}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="input w-full mb-4"
            maxLength={10}
          />

          <select
            name="paymentMode"
            value={form.paymentMode}
            onChange={handleChange}
            className="input w-full mb-4"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input w-full mb-6"
          />

          <button className="btn-primary w-full" onClick={handleSubmit}>
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
