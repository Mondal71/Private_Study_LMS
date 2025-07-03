import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AdminLogin() {
  const [email, setEmail] = useState(""); // ✅ CHANGED
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/admin/login", { email, password }); // ✅ CHANGED

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminName", res.data.user.name); // ✅ KEEP
        alert("Login successful!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Admin Login
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full mb-6"
          />
          <button className="btn-primary w-full" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
