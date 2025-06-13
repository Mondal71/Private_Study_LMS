import { useState, useEffect } from "react"; // ✅ useEffect for console log
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserVerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const phone = localStorage.getItem("tempPhone");


  // ✅ Add this useEffect block to see when page renders
  useEffect(() => {
    console.log("UserVerifyOTP page loaded");
  }, []);

  const handleVerify = async () => {
    try {
      const res = await API.post("/users/verify", { phone, otp });
      console.log("Response:", res.data);
      if (res.data.message === "User verified successfully") {
        navigate("/user/set-password");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            OTP sent to: <span className="font-medium">{phone}</span>
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input w-full mb-6 text-center tracking-widest"
            maxLength={6}
          />
          <button className="btn-primary" onClick={handleVerify}>
            Verify OTP
          </button>
        </div>
      </div>
    </>
  );
}
