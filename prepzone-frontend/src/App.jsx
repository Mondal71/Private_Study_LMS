import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import UserSignup from "./pages/user/UserSignup"; 
import UserVerifyOTP from "./pages/user/UserVerifyOTP";
import UserSetPassword from "./pages/user/UserSetPassword";
import UserLogin from "./pages/user/UserLogin";


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
      </Routes>
    </Router>
  );
}
