import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter email and password");
    }

    try {
      const res = await API.post("/user/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token); 
        localStorage.setItem("role", "user");
        alert("Login successful!");
        navigate("/user/dashboard");
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
            User Login
          </h2>
          <input
            type="email"
            placeholder="Email Address"
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
          <button className="btn-primary w-full mb-2" onClick={handleLogin}>
            Login
          </button>
          <Link to="/user/forgot" className="text-blue-500 text-base mt-2">
            Forgot Password?
          </Link>
        </div>
      </div>
    </>
  );
}
