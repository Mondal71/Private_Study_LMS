import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await API.post("/users/signup", { name, phone });
      if (res.data.message === "OTP sent successfully") {
        localStorage.setItem("tempPhone", phone);
        navigate("/user/verify");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            User Signup
          </h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full mb-4"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input w-full mb-6"
          />
          <button className="btn-primary" onClick={handleSignup}>
            Send OTP
          </button>
        </div>
      </div>
    </>
  );
}
