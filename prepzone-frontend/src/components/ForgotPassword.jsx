import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { role } = useParams(); //  Use only useParams

  const handleSendOTP = async () => {
    try {
      const res = await API.post(`/${role}/forgot/send-otp`, { email });
      alert(res.data.message);
      localStorage.setItem("forgotEmail", email); // Store email
      navigate(`/${role}/forgot/verify`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Forgot Password ({role})</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input w-full mb-4"
      />
      <button onClick={handleSendOTP} className="btn-primary w-full">
        Send OTP
      </button>
    </div>
  );
}
