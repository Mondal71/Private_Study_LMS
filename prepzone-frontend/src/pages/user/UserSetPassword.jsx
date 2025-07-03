import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function UserSetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("tempUserEmail"); // ✅ use email instead of phone

  const handleSetPassword = async () => {
    if (!email) {
      alert("Email not found in session. Please signup again.");
      navigate("/user/signup");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/user/set-password", { email, password }); // ✅ send email instead of phone
      if (
        res.data.success ||
        res.data.message === "Password set successfully"
      ) {
        localStorage.removeItem("tempUserEmail"); // ✅ cleanup email key
        alert("Password set successfully! You can now login.");
        navigate("/user/login");
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
            Set Your Password
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
