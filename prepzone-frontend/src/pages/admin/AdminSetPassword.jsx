import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AdminSetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const phone = localStorage.getItem("tempAdminPhone");

  const handleSetPassword = async () => {
    if (!phone) {
      alert("Phone not found. Please signup again.");
      navigate("/admin/signup");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await API.post("/admin/set-password", { phone, password });
      if (res.data.message === "Password set successfully") {
        localStorage.removeItem("tempAdminPhone");
        alert("Password set! Please login.");
        navigate("/admin/login");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to set password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Set Password (Admin)
          </h2>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input w-full mb-6"
          />
          <button className="btn-primary w-full" onClick={handleSetPassword}>
            Set Password
          </button>
        </div>
      </div>
    </>
  );
}
