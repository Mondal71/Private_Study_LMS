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
    <header className="bg-white shadow sticky top-0 z-50">
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

        {/* Searchbar visible only in dashboard */}
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

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 border-t">
          {showSearch && (
            <input
              type="text"
              placeholder="Search by location..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            />
          )}

          <Link to="/" className="block text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-700 hover:text-indigo-600"
          >
            About
          </Link>

          {isLoggedIn && role === "user" && (
            <>
              <Link
                to="/user/dashboard"
                className="block text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to="/user/my-bookings"
                className="block text-gray-700 hover:text-indigo-600"
              >
                My Bookings
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Admin Panel
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              to="/user/login"
              className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-center"
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
