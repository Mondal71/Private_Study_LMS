import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function EditLibraryForm() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/libraries/admin/my-libraries", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lib = res.data.libraries.find((l) => l._id === id);
        if (!lib) {
          alert("Library not found");
          return navigate("/admin/dashboard");
        }

        setForm({
          name: lib.name,
          location: lib.location,
          totalSeats: lib.totalSeats,
          availableSeats: lib.availableSeats,
          amenities: lib.amenities?.join(", ") || "",
          phoneNumber: lib.phoneNumber || "",
          address: lib.address || "",
          sixHour: lib.prices?.sixHour || "",
          twelveHour: lib.prices?.twelveHour || "",
          twentyFourHour: lib.prices?.twentyFourHour || "",
        });
        setLoading(false);
      } catch (err) {
        alert("Failed to load library");
        navigate("/admin/dashboard");
      }
    };

    fetchLibrary();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const amenities = form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

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

      await API.put(`/libraries/admin/library/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Library updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[90vh] flex justify-center items-center bg-gray-100">
          <p className="text-xl text-gray-600">Loading library data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[90vh] flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Update Library
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
            className="input w-full mb-4"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Contact Phone Number"
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
            className="input w-full mb-4"
          />

          {/* ✅ Pricing fields */}
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

          <button className="btn-primary w-full" onClick={handleUpdate}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
