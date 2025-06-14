import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import UserSignup from "./pages/user/UserSignup";
import UserVerifyOTP from "./pages/user/UserVerifyOTP";
import UserSetPassword from "./pages/user/UserSetPassword";
import UserLogin from "./pages/user/UserLogin";
import Dashboard from "./pages/user/Dashboard";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminVerifyOTP from "./pages/admin/AdminVerifyOTP";
import AdminSetPassword from "./pages/admin/AdminSetPassword";
import AdminLogin from "./pages/admin/AdminLogin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/verify" element={<UserVerifyOTP />} />
        <Route path="/user/set-password" element={<UserSetPassword />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/verify" element={<AdminVerifyOTP />} />
        <Route path="/admin/set-password" element={<AdminSetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}
