import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function SetNewPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { role } = useParams();
  const email = localStorage.getItem("forgotEmail");

  const handleReset = async () => {
    try {
      await API.post(`/${role}/forgot/reset-password`, {
        email,
        newPassword: password,
      });

      alert("Password reset successful");
      localStorage.removeItem("forgotEmail");
      localStorage.removeItem("role");
      navigate(`/${role}/login`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input w-full mb-4"
      />
      <button onClick={handleReset} className="btn-primary w-full">
        Reset Password
      </button>
    </div>
  );
}
