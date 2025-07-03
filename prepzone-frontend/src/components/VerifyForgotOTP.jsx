import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function VerifyForgotOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { role } = useParams();
  const email = localStorage.getItem("forgotEmail");

  const handleVerify = async () => {
    try {
      const res = await API.post(`/${role}/forgot/verify-otp`, { email, otp });
      alert("OTP Verified");
      navigate(`/${role}/forgot/new-password`);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="input w-full mb-4"
      />
      <button onClick={handleVerify} className="btn-primary w-full">
        Verify OTP
      </button>
    </div>
  );
}
