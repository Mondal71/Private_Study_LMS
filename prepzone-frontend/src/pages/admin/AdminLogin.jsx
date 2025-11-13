import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await API.post("/admin/login", { email, password }); 

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminName", res.data.user.name); 
        alert("Login successful!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Owner Login
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
          <button
            className="btn-primary w-full mb-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <Link to="/admin/forgot" className="text-blue-500 text-base mt-2">
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
}
