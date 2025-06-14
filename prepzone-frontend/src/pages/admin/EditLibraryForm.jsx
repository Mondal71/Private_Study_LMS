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
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get(`/libraries/admin/my-libraries`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const lib = res.data.libraries.find((l) => l._id === id);
      if (lib) {
        setForm({
          name: lib.name,
          location: lib.location,
          totalSeats: lib.totalSeats,
          availableSeats: lib.availableSeats,
          amenities: lib.amenities.join(", "),
        });
      }
    });
  }, [id]);

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
        name: form.name,
        location: form.location,
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
        amenities,
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
            className="input w-full mb-6"
          />
          <button className="btn-primary w-full" onClick={handleUpdate}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
