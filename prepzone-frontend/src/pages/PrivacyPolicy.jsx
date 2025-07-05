import React from "react";
import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Privacy Policy
        </h1>
        <p className="mb-4">
          At <strong>PrepZone</strong>, your privacy is important to us. This
          Privacy Policy outlines how we collect, use, and protect your personal
          data.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Full name, email, phone number, and Aadhar number (for bookings).
          </li>
          <li>Library selection, payment method, and booking details.</li>
          <li>Usage data like time spent on pages or booking history.</li>
        </ul>

        <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process bookings and payments.</li>
          <li>
            To communicate important information like confirmations or updates.
          </li>
          <li>To improve our services and security.</li>
        </ul>

        <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
          3. Data Security
        </h2>
        <p>
          We implement best practices to secure your data using encryption and
          access control. However, no method is 100% secure.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
          4. Third-party Services
        </h2>
        <p>
          We use Razorpay for payments. Your payment data is processed by
          Razorpay, and we do not store any card details.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
          5. Contact Us
        </h2>
        <p>
          If you have questions, contact us at{" "}
          <strong>prepzone.support@gmail.com</strong>.
        </p>

        <p className="mt-6 text-sm text-gray-500">Last updated: July 2025</p>
      </div>
    </>
  );
}
