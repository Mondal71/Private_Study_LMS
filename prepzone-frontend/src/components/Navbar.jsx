import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ onSearch }) {
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showSearch =
    isLoggedIn && role === "user" && location.pathname === "/user/dashboard";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://img.icons8.com/color/48/000000/books.png"
            alt="logo"
            className="w-7 h-7"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-700">
            PrepZone
          </h1>
        </Link>

        {/* Desktop Search */}
        {showSearch && (
          <input
            type="text"
            placeholder="Search by location..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="hidden md:block px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring focus:border-indigo-300"
          />
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600">
            About
          </Link>

          {/* Add Refund and Privacy Policy links */}
          <Link to="/refund-policy" className="text-gray-700 hover:text-indigo-600">
            Refund Policy
          </Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-indigo-600">
            Privacy Policy
          </Link>

          {isLoggedIn && role === "user" && (
            <>
              <Link
                to="/user/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to="/user/my-bookings"
                className="text-gray-700 hover:text-indigo-600"
              >
                My Bookings
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-indigo-600"
            >
              Admin Panel
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              to="/user/login"
              className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Hamburger Button - Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar - Mobile (Below Logo) */}
      {showSearch && (
        <div className="md:hidden px-4 pb-2">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
          />
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-[70px] right-4 bg-white border rounded-lg shadow-lg p-4 w-[75%] max-w-[250px] z-50 md:hidden">
          <Link
            to="/"
            className="block text-gray-700 hover:text-indigo-600 mb-2"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-indigo-600 mb-2"
          >
            About
          </Link>

          {/* Add Refund and Privacy Policy links */}
          <Link
            to="/refund-policy"
            className="block text-gray-700 hover:text-indigo-600 mb-2"
          >
            Refund Policy
          </Link>
          <Link
            to="/privacy-policy"
            className="block text-gray-700 hover:text-indigo-600 mb-2"
          >
            Privacy Policy
          </Link>

          {isLoggedIn && role === "user" && (
            <>
              <Link
                to="/user/dashboard"
                className="block text-gray-700 hover:text-indigo-600 mb-2"
              >
                Dashboard
              </Link>
              <Link
                to="/user/my-bookings"
                className="block text-gray-700 hover:text-indigo-600 mb-2"
              >
                My Bookings
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="block text-gray-700 hover:text-indigo-600 mb-2"
            >
              Admin Panel
            </Link>
          )}
          {!isLoggedIn ? (
            <Link
              to="/user/login"
              className="block bg-indigo-600 text-white text-center px-4 py-2 rounded-md"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
