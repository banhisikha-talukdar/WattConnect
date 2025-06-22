import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function MeterSchedule() {
  const [consumerNumber, setConsumerNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleNext = () => {
    if (/^\d{12}$/.test(consumerNumber)) {
      navigate("/customer/schedule_my_meter_form");
    } else {
      setError("Invalid consumer number");
    }
  };

  const handleNoConsumer = () => {
    alert("Invalid consumer or consumer does not exist.");
    navigate("/customer/dashboard");
  };

  return (
    <div className="flex h-screen bg-[#dfeafa] relative">
      <Navbar type="customer" />

      {/* Success message container (if redirected after form submission) */}
      {state?.message && (
        <div className="absolute top-6 right-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg z-10">
          <p className="font-medium">{state.message}</p>
          <p className="text-sm text-gray-700">Submitted on: {state.submittedAt}</p>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Schedule Meter Installation Visit
          </h2>
          <label className="block text-gray-700 mb-2">
            Enter 12-digit Consumer Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={12}
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 123456789012"
            />
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={handleNoConsumer}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            I don’t have consumer number
          </button>
        </div>
      </div>
    </div>
  );
}
