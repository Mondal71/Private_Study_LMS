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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddLibraryForm from "./pages/admin/AddLibraryForm";
import EditLibraryForm from "./pages/admin/EditLibraryForm";
import BookLibrary from "./pages/user/BookLibrary";
import MyBookings from "./pages/user/MyBookings";
import LibraryReservations from "./pages/admin/LibraryReservations";



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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-library" element={<AddLibraryForm />} />
        <Route path="/admin/edit-library/:id" element={<EditLibraryForm />} />
        <Route path="/user/book/:id" element={<BookLibrary />} />
        <Route path="/user/my-bookings" element={<MyBookings />} />
        <Route
          path="/admin/library/:libraryId/reservations"
          element={<LibraryReservations />}
        />
      </Routes>
    </Router>
  );
}
