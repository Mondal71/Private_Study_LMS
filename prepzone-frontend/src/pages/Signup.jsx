import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!name || !phone) {
        alert("Name and phone are required");
        return;
      }

      setLoading(true);
      await API.post("/users/signup", { name, phone });
      localStorage.setItem("tempPhone", phone);
      navigate("/verify");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          PrepZone - Sign Up
        </h2>

        <input
          type="text"
          placeholder="Enter your name"
          className="input w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Enter your phone number"
          className="input w-full mb-6"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          className="btn-primary w-full"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}
