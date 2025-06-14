import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // 📡 send query to dashboard
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://img.icons8.com/color/48/000000/books.png"
              alt="logo"
              className="w-7 h-7"
            />
            <h1 className="text-2xl font-bold text-indigo-700">PrepZone</h1>
          </Link>
        </div>

        {/* Search Bar (Only show on dashboard) */}
        {location.pathname === "/user/dashboard" && (
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search by area..."
            className="input w-full md:w-64"
          />
        )}

        {/* Nav Links */}
        <nav className="space-x-4 text-center md:text-right">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            About
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/user/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/user/login"
              className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
