import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RoleSelector from "../components/RoleSelector";

export default function HomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(null);

  return (
    <>
      <Navbar />

      {/* Welcome Line */}
      <div className="border-t-2 border-indigo-600 text-center py-4">
        <h2 className="text-6xl font-bold text-indigo-700 animate-pulse tracking-wide">
          — Welcome to PrepZone —
        </h2>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-50 min-h-[75vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-6 animate-fade-in">
            <h2 className="text-xl text-indigo-500 font-semibold">
              Private Study System
            </h2>
            <h1 className="text-4xl font-bold text-gray-800">
              Find <span className="text-indigo-600">Peaceful Libraries</span>{" "}
              Near You
            </h1>
            <p className="text-gray-600">
              PrepZone helps you book seats in study libraries near your area.
              Start now by choosing your role and action.
            </p>

            {/* Login/Signup Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => setStep("login")}
                className="btn-primary w-32 border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-500"
              >
                Login
              </button>
              <button
                onClick={() => setStep("signup")}
                className="btn-primary w-32 border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-500"
              >
                Sign Up
              </button>
            </div>

            {/* Show RoleSelector inline just below buttons */}
            {step && (
              <div className="pt-6">
                <RoleSelector action={step} />
              </div>
            )}
          </div>

          {/* Right image */}
          <div className="md:w-1/2">
            <img
              src="https://img.freepik.com/free-photo/portrait-happy-young-woman-holding-red-book_23-2148430867.jpg"
              alt="study"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
}
