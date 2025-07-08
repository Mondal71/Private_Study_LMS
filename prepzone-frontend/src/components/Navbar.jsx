import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ onSearch }) {
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const showSearch =
    isLoggedIn && role === "user" && location.pathname === "/user/dashboard";

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Close mobile menu on large screens
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://img.icons8.com/color/48/000000/books.png"
              alt="logo"
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-700">
              PrepZone
            </h1>
          </Link>

          {/* Desktop Search - Show on medium screens and up */}
          {showSearch && (
            <div className="hidden sm:block flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search by location..."
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-indigo-300 text-sm lg:text-base"
              />
            </div>
          )}

          {/* Desktop Navigation - Show on large screens */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base">
              About
            </Link>

            {/* Add Refund and Privacy Policy links */}
            <Link to="/refund-policy" className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base">
              Refund Policy
            </Link>
            <Link to="/privacy-policy" className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base">
              Privacy Policy
            </Link>

            {isLoggedIn && role === "user" && (
              <>
                <Link
                  to="/user/dashboard"
                  className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/my-bookings"
                  className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base"
                >
                  My Bookings
                </Link>
              </>
            )}

            {isLoggedIn && role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-gray-700 hover:text-indigo-600 text-sm lg:text-base"
              >
                Admin Panel
              </Link>
            )}

            {!isLoggedIn ? (
              <Link
                to="/user/login"
                className="bg-indigo-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md hover:bg-indigo-700 text-sm lg:text-base transition-colors"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md hover:bg-red-700 text-sm lg:text-base transition-colors"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Medium Screen Navigation - Show on medium screens but hide on large */}
          <nav className="hidden sm:flex lg:hidden items-center gap-3">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 text-sm">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 text-sm">
              About
            </Link>
            
            {!isLoggedIn ? (
              <Link
                to="/user/login"
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 text-sm"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Hamburger Button - Show on small screens and medium screens */}
          <div className="sm:hidden lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none p-1"
              aria-label="Toggle menu"
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
          <div className="sm:hidden px-0 pb-3">
            <input
              type="text"
              placeholder="Search by location..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            />
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 sm:hidden lg:hidden">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/"
                className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Add Refund and Privacy Policy links */}
              <Link
                to="/refund-policy"
                className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Refund Policy
              </Link>
              <Link
                to="/privacy-policy"
                className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </Link>

              {isLoggedIn && role === "user" && (
                <>
                  <Link
                    to="/user/dashboard"
                    className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/user/my-bookings"
                    className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {isLoggedIn && role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-700 hover:text-indigo-600 py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                {!isLoggedIn ? (
                  <Link
                    to="/user/login"
                    className="block bg-indigo-600 text-white text-center px-4 py-2 rounded-md text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-base"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
