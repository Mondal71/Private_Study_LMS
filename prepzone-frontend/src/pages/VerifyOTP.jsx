import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const phone = localStorage.getItem("tempPhone");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      if (!otp) return alert("Please enter OTP");

      await API.post("/users/verify", { phone, otp });
      navigate("/set-password");
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-50 to-pink-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Verify OTP
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          OTP sent to <strong>{phone}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="input w-full mb-6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn-primary w-full" onClick={handleVerify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}
