import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          About PrepZone
        </h1>
        <p className="text-gray-600 text-lg">
          PrepZone is a student-focused app to help you find libraries and study
          spaces in your area.
        </p>
      </div>
    </>
  );
}
