import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AddLibraryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    totalSeats: "",
    availableSeats: "",
    amenities: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const features = form.amenities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      const payload = {
        name: form.name,
        location: form.location,
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
        features,
      };

      const res = await API.post("/libraries/admin/library", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Library added successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add library");
    }
  };

  return (
    <>
      <Navbar />
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
            placeholder="Location"
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
            className="input w-full mb-6"
          />

          <button className="btn-primary w-full" onClick={handleSubmit}>
            Submit Library
          </button>
        </div>
      </div>
    </>
  );
}
