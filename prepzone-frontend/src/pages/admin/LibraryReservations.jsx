import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";

export default function LibraryReservations() {
  const navigate = useNavigate();
  const { libraryId } = useParams();
  const [reservations, setReservations] = useState([]);
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    fetchReservations(token);
    fetchLibrary(token);
  }, [libraryId]);

  const fetchReservations = async (token) => {
    try {
      const res = await API.get(`/reservations/library/${libraryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data.reservations);
    } catch (err) {
      console.error("Fetch Reservations Error:", err.message);
    }
  };

  const fetchLibrary = async (token) => {
    try {
      const res = await API.get(`/libraries/${libraryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrary(res.data.library);
    } catch (err) {
      console.error("Fetch Library Error:", err.message);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/reservations/${reservationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Reservation ${newStatus} successfully`);
      fetchReservations(token);
    } catch (err) {
      alert(err.response?.data?.error || "Status update failed");
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] px-4 py-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">
              📄 Library Reservations
            </h1>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="btn-primary bg-gray-600 hover:bg-gray-700"
            >
              ← Back to Dashboard
            </button>
          </div>

          {library && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {library.name}
              </h2>
              <p className="text-gray-600">Location: {library.location}</p>
              <p className="text-gray-600">
                Available Seats: {library.availableSeats} / {library.totalSeats}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {reservations.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No reservations found for this library.
              </p>
            ) : (
              reservations.map((res) => (
                <div
                  key={res._id}
                  className="bg-white shadow p-4 rounded-lg border border-gray-200"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Name:</strong> {res.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {res.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {res.phoneNumber}
                      </p>
                      <p>
                        <strong>Aadhar:</strong> {res.aadhar}
                      </p>
                      <p>
                        <strong>DOB:</strong> {res.dob}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Duration:</strong> {res.duration}
                      </p>
                      <p>
                        <strong>Payment Mode:</strong> {res.paymentMode}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{res.price}
                      </p>
                      <p>
                        <strong>Booked On:</strong>{" "}
                        {new Date(res.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            res.status === "confirmed"
                              ? "text-green-600"
                              : res.status === "cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {res.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {res.message && (
                    <div className="mt-3 p-2 bg-gray-100 rounded">
                      <strong>Message:</strong> {res.message}
                    </div>
                  )}

                  {res.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(res._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        ✅ Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(res._id, "cancelled")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
