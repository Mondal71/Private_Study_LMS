import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <img
                src="https://img.icons8.com/color/48/000000/books.png"
                alt="logo"
                className="w-6 h-6"
              />
              <h3 className="text-xl font-bold text-indigo-300">PrepZone</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              India's trusted library booking platform. Find peaceful study spaces near you for better productivity and focused learning.
            </p>
            <div className="text-gray-400 text-xs">
              <p>📍 Bhopal, Madhya Pradesh, India</p>
              <p>📧 support@prepzone.com</p>
              <p>📞 +91-XXXXXXXXXX</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-3 text-indigo-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Browse Libraries
                </Link>
              </li>
              <li>
                <Link to="/user/my-bookings" className="text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-3 text-indigo-300">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Library Seat Booking</li>
              <li className="text-gray-300">Study Space Discovery</li>
              <li className="text-gray-300">Real-time Availability</li>
              <li className="text-gray-300">Secure Payment Gateway</li>
              <li className="text-gray-300">24/7 Customer Support</li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-3 text-indigo-300">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li className="text-gray-300">Terms of Service</li>
              <li className="text-gray-300">Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PrepZone. All rights reserved. | Made with for students
          </p>
        </div>
      </div>
    </footer>
  );
} 