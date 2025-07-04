import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import noImage from "../../photo/default.jpg";

export default function Dashboard() {
  const [libraries, setLibraries] = useState([]);
  const [searchArea, setSearchArea] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/user/login");
      return;
    }

    axios
      .get("/api/libraries/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLibraries(response.data.libraries);
      })
      .catch((error) => {
        console.error("Error fetching libraries:", error.message);
      });
  }, [navigate]);

  const filteredLibraries = libraries.filter((lib) =>
    lib.location?.toLowerCase().includes(searchArea.toLowerCase())
  );

  return (
    <>
      <Navbar onSearch={(text) => setSearchArea(text)} />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Available Libraries
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLibraries.map((library) => (
            <div
              key={library._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={library.image || noImage}
                alt={library.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-indigo-800">
                  {library.name}
                </h2>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Location:</strong> {library.location}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Total Seats:</strong> {library.totalSeats}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Available:</strong> {library.availableSeats}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Phone:</strong> {library.phoneNumber || "N/A"}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Address:</strong> {library.address || "N/A"}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Amenities:</strong>{" "}
                  {Array.isArray(library.amenities)
                    ? library.amenities.join(", ")
                    : "N/A"}
                </p>

                {/* Price Section */}
                <div className="text-sm text-gray-700 mt-3 space-y-1">
                  <p>
                    <strong>Price (6hr):</strong> ₹
                    {library?.prices?.sixHour || "N/A"}
                  </p>
                  <p>
                    <strong>Price (12hr):</strong> ₹
                    {library?.prices?.twelveHour || "N/A"}
                  </p>
                  <p>
                    <strong>Price (24hr):</strong> ₹
                    {library?.prices?.twentyFourHour || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/user/book/${library._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-4"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLibraries.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No libraries found for this area.
          </p>
        )}
      </div>
    </>
  );
}
