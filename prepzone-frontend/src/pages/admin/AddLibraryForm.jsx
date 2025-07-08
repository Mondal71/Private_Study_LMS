import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";

export default function AddLibraryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSeats: "",
    availableSeats: "",
    amenities: "",
    phoneNumber: "",
    address: "",
    sixHour: "",
    twelveHour: "",
    twentyFourHour: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const amenities = form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");

      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
        amenities,
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        prices: {
          sixHour: Number(form.sixHour),
          twelveHour: Number(form.twelveHour),
          twentyFourHour: Number(form.twentyFourHour),
        },
      };

      await API.post("/libraries/admin/library", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Library added successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add library");
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Add New Library
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Library Name"
            value={form.name}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="text"
            name="location"
            placeholder="City/Area"
            value={form.location}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            value={form.totalSeats}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="number"
            name="availableSeats"
            placeholder="Available Seats"
            value={form.availableSeats}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="text"
            name="amenities"
            placeholder="Amenities (comma-separated)"
            value={form.amenities}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Contact Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="input w-full mb-4"
          />
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            className="input w-full mb-6"
          />

          {/* Pricing Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <input
              type="number"
              name="sixHour"
              placeholder="Price (6 hrs)"
              value={form.sixHour}
              onChange={handleChange}
              className="input"
            />
            <input
              type="number"
              name="twelveHour"
              placeholder="Price (12 hrs)"
              value={form.twelveHour}
              onChange={handleChange}
              className="input"
            />
            <input
              type="number"
              name="twentyFourHour"
              placeholder="Price (24 hrs)"
              value={form.twentyFourHour}
              onChange={handleChange}
              className="input"
            />
          </div>

          <button className="btn-primary w-full" onClick={handleSubmit}>
            Submit Library
          </button>
        </div>
      </div>
    </Layout>
  );
}
