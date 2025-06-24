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
    photo: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.aadhar || !form.phone || !form.photo) {
      alert("Please fill all required fields and upload a photo.");
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
