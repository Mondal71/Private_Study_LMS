import Navbar from "../components/Navbar";
import founderImg from "../assets/founder.jpg"; // 👈 apna image yaha rakhna
import studyImg from "../assets/study.jpg"; // 👈 koi library ya study related image bhi

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              India’s Trusted Library Booking App
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              PrepZone is not just an app, it's a revolution in how students
              find peaceful and productive study environments.
            </p>
            <p className="text-gray-700">
              With verified libraries, real-time seat updates, and user reviews,
              PrepZone ensures every student has access to quality study space
              near them.
            </p>
          </div>
          <img src={studyImg} alt="Study" className="rounded-2xl shadow-lg" />
        </div>

        {/* Why Choose Us */}
        <div className="bg-yellow-50 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Why Students Love PrepZone?
            </h2>
            <p className="text-gray-700 mb-6">
              We help students dodge distractions and stay focused by connecting
              them with the best study environments around them. Whether you're
              preparing for competitive exams, group study, or solo sessions —
              we got you!
            </p>
          </div>
        </div>

        {/* Founders Section */}
        <div className="py-12 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Meet the Founder
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={founderImg}
              alt="Founder"
              className="w-40 h-40 object-cover rounded-full shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold">Amit Mondal</h3>
              <p className="text-sm text-gray-600">Founder & Developer</p>
              <p className="mt-4 text-gray-700">
                I'm Amit, a passionate final-year MCA student at Maulana Azad
                National Institute of Technology, Bhopal. I built PrepZone to
                address real-life challenges that students face every day. My
                mission with PrepZone is to make studying more accessible,
                productive, and stress-free for every learner.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600 text-white py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Want to Partner or Collaborate?
          </h2>
          <p className="mb-6">
            We're always open to exciting ideas and growth opportunities!
          </p>
          <a
            href="mailto:your-email@example.com"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
