import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AdminVerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const email = localStorage.getItem("tempAdminEmail"); 

  const handleVerify = async () => {
    setLoading(true)
    try {
      const res = await API.post("/admin/verify", { email, otp }); 
      if (
        res.data.success ||
        res.data.message === "Admin verified successfully"
      ) {
        navigate("/admin/set-password");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
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
            Verify OTP (Owner)
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            OTP sent to: <span className="font-medium">{email}</span>{" "}
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input w-full mb-6 text-center tracking-widest"
            maxLength={6}
          />
          <button
            className="btn-primary w-full"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Loading..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </>
  );
}
