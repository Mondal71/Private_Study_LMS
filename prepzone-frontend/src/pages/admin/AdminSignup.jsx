import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AdminSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await API.post("/admin/signup", { name, email }); 
      if (
        res.data.success ||
        res.data.message === "OTP sent to email successfully"
      ) {
        localStorage.setItem("tempAdminEmail", email); 
        navigate("/admin/verify");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Admin Signup
          </h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="email"
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full mb-6"
          />
          <button className="btn-primary w-full" onClick={handleSignup}>
            Send OTP
          </button>
        </div>
      </div>
    </>
  );
}
