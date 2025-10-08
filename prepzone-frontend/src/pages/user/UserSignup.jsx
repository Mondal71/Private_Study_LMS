import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email) {
      return alert("Please enter name and email");
    }

    setLoading(true);

    try {
      const res = await API.post("/user/signup", { name, email }); 
      if (res.data.message === "OTP sent to email successfully") {
        localStorage.setItem("tempUserEmail", email); 
        navigate("/user/verify");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
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
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full mb-6"
          />
          <button
            className="btn-primary w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Loading..." : "Send OTP"}
          </button>
        </div>
      </div>
    </>
  );
}
