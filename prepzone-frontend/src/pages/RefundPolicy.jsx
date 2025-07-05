import React from "react";
import Navbar from "../components/Navbar";

export default function RefundPolicy() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Refund Policy
        </h1>
        <p className="mb-4">
          At <strong>PrepZone</strong>, we believe in fair use and transparent
          policies.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            No refunds will be processed once a library seat is booked and
            confirmed.
          </li>
          <li>
            Refunds will only be considered if:
            <ul className="list-disc pl-6 mt-1">
              <li>Payment was deducted but booking was not created.</li>
              <li>
                Network failure caused multiple payments for the same seat.
              </li>
            </ul>
          </li>
          <li>
            Refunds are processed within 5–7 working days to the original
            payment method.
          </li>
        </ul>
        <p className="mt-6 text-sm text-gray-500">Last updated: July 2025</p>
      </div>
    </>
  );
}
