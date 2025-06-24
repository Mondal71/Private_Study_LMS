// ✅ pages/admin/LibraryReservations.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function LibraryReservations() {
  const { libraryId } = useParams();
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await API.get(`/reservations/admin/reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.reservations.filter(
          (r) => r.libraryId._id === libraryId
        );

        setReservations(filtered);
      } catch (err) {
        alert("Failed to fetch reservations");
      }
    };

    fetchReservations();
  }, [libraryId]);

  const handleDecision = async (id, decision) => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.put(
        `/reservations/admin/reservations/${id}/decision`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Decision updated");

      setReservations((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status: decision === "accept" ? "confirmed" : "cancelled",
                message:
                  decision === "accept"
                    ? "Admission done successfully"
                    : "Reservation rejected. Payment refunded.",
              }
            : r
        )
      );
    } catch (err) {
      alert("Failed to update reservation");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          📋 Reservations for This Library
        </h2>

        {reservations.length === 0 ? (
          <p>No reservations for this library.</p>
        ) : (
          reservations.map((res) => (
            <div
              key={res._id}
              className="border p-4 mb-4 rounded bg-white shadow"
            >
              <p>
                <strong>User Name:</strong> {res.userId?.name}
              </p>
              <p>
                <strong>Aadhar:</strong> {res.aadhar}
              </p>
              <p>
                <strong>Phone:</strong> {res.phoneNumber}
              </p>
              <p>
                <strong>Payment Mode:</strong> {res.paymentMode}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    res.status === "pending"
                      ? "text-yellow-600"
                      : res.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {res.status}
                </span>
              </p>
              <p>
                <strong>Message:</strong> {res.message || "--"}
              </p>
              {res.photo && (
                <img
                  src={`http://localhost:5000${res.photo}`}
                  alt="User"
                  className="w-32 h-32 mt-2 border rounded"
                />
              )}
              {res.status === "pending" &&
                res.message !== "Admission cancelled by user" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleDecision(res._id, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() => handleDecision(res._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
            </div>
          ))
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}
