import Layout from "../components/Layout";

export default function RefundPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Booking Cancellation</h2>
            <p className="text-gray-700 mb-4">
              You may cancel your booking up to 24 hours before your scheduled time. 
              Cancellations made within 24 hours may be subject to partial refunds or no refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Refund Eligibility</h2>
            <p className="text-gray-700 mb-4">
              Refunds are available under the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Cancellation made 24+ hours before booking time</li>
              <li>Library closure or unavailability</li>
              <li>Technical issues preventing service delivery</li>
              <li>Duplicate or erroneous bookings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Refund Process</h2>
            <p className="text-gray-700 mb-4">
              Refunds will be processed within 5-7 business days and will be credited back to your 
              original payment method. You will receive an email confirmation once the refund is processed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Non-Refundable Items</h2>
            <p className="text-gray-700 mb-4">
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>No-shows or late arrivals</li>
              <li>Cancellations within 24 hours of booking</li>
              <li>Service fees and processing charges</li>
              <li>Bookings used or partially used</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our refund policy or need to request a refund, 
              please contact us at:
            </p>
            <p className="text-gray-700">
              Email: refunds@prepzone.com<br />
              Phone: +91-XXXXXXXXXX<br />
              Address: PrepZone, Bhopal, Madhya Pradesh, India
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
