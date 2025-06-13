import { Link } from "react-router-dom";

export default function Navbar() {
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
          <Link
            to="/user/login"
            className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
