import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import API from "../../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/user/login");
      return;
    }

    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const res = await API.get("/reservations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.reservations);
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/reservations/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking cancelled successfully.");
      fetchBookings(token);
    } catch (err) {
      alert(err.response?.data?.error || "Cancellation failed.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          📋 My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((res) => (
              <div
                key={res._id}
                className="bg-white shadow p-4 rounded border border-gray-200"
              >
                <p>
                  <strong>Library:</strong> {res.libraryId?.name || "Unknown"}
                </p>
                <p>
                  <strong>Address:</strong> {res.libraryId?.location || "N/A"}
                </p>
                <p>
                  <strong>Aadhar:</strong> {res.aadhar || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {res.phoneNumber || "N/A"}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {res.paymentMode}
                </p>
                <p>
                  <strong>Duration:</strong> {res.duration || "N/A"}
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
                <p>
                  <strong>Message:</strong>{" "}
                  {res.message ? res.message : "Waiting for admin response..."}
                </p>
                <p>
                  <strong>Booked On:</strong>{" "}
                  {new Date(res.createdAt).toLocaleString()}
                </p>

                {res.status === "pending" && (
                  <button
                    onClick={() => handleCancel(res._id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    ❌ Cancel Booking
                  </button>
                )}

                {res.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(res._id)}
                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    🔔 Cancel Subscription
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
