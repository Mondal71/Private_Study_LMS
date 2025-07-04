import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState([]);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("adminName");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    if (name) setAdminName(name);
    fetchMyLibraries(token);
  }, []);

  const fetchMyLibraries = async (token) => {
    try {
      const res = await API.get("/libraries/admin/my-libraries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibraries(res.data.libraries);
    } catch (err) {
      console.error("Fetch Libraries Error:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this library?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/libraries/admin/library/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Library deleted successfully");
      fetchMyLibraries(token);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[90vh] px-4 py-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            Welcome, {adminName} 👋
          </h1>

          <div className="flex justify-between items-center mb-4">
            <button
              className="btn-primary"
              onClick={() => navigate("/admin/add-library")}
            >
              + Add Library
            </button>
          </div>

          <h1 className="text-4xl font-semibold m-3">📚 Your Libraries</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {libraries.map((lib) => (
              <div
                key={lib._id}
                className="bg-white shadow-md p-4 rounded-lg space-y-2"
              >
                <h3 className="text-lg font-bold text-indigo-700">
                  {lib.name}
                </h3>
                <p className="text-gray-600">Location: {lib.location}</p>
                <p className="text-gray-600">Total Seats: {lib.totalSeats}</p>
                <p className="text-gray-600">Available: {lib.availableSeats}</p>
                <p className="text-sm text-gray-500 italic">
                  Amenities: {lib.amenities?.join(", ") || "--"}
                </p>
                <p className="text-gray-600">
                  Phone: {lib.phoneNumber || "--"}
                </p>
                <p className="text-gray-600">Address: {lib.address || "--"}</p>

                {/* Pricing Section */}
                <div className="mt-3 text-sm text-gray-800 space-y-1">
                  <p>
                    <strong>Price (6hr):</strong> ₹
                    {lib?.prices?.sixHour || "N/A"}
                  </p>
                  <p>
                    <strong>Price (12hr):</strong> ₹
                    {lib?.prices?.twelveHour || "N/A"}
                  </p>
                  <p>
                    <strong>Price (24hr):</strong> ₹
                    {lib?.prices?.twentyFourHour || "N/A"}
                  </p>
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => navigate(`/admin/edit-library/${lib._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lib._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    ❌ Delete
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/library/${lib._id}/reservations`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    📄 View Reservations
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-10 w-full btn-primary bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
