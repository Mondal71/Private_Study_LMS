import { Link, useLocation } from "react-router-dom";

export default function Navbar({ onSearch }) {
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  const showSearch =
    isLoggedIn && role === "user" && location.pathname === "/user/dashboard";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://img.icons8.com/color/48/000000/books.png"
            alt="logo"
            className="w-7 h-7"
          />
          <h1 className="text-2xl font-bold text-indigo-700">PrepZone</h1>
        </Link>

        {showSearch && (
          <input
            type="text"
            placeholder="Search by location..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="px-3 py-1 border rounded-md w-64 focus:outline-none focus:ring focus:border-indigo-300"
          />
        )}

        <nav className="space-x-4">
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

          {isLoggedIn && role === "user" && (
            <>
              <Link
                to="/user/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/user/my-bookings"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                My Bookings
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Admin Panel
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              to="/user/login"
              className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          ) : (
            <button
              className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
