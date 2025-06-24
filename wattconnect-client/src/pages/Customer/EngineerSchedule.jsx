import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function EngineerSchedule() {
  const [consumerNumber, setConsumerNumber] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  // Load submission message if redirected from form
  const hasAddedSubmission = useRef(false);

  useEffect(() => {
    if (state?.message && !hasAddedSubmission.current) {
      setSubmissions((prev) => [
        ...prev,
        {
          message: state.message,
          submittedAt: state.submittedAt,
          status: "Pending",
        },
      ]);

      hasAddedSubmission.current = true;

      // Clear the state after processing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [state, navigate, location.pathname]);



  const handleNext = () => {
    if (/^\d{12}$/.test(consumerNumber)) {
      navigate("/customer/schedule_my_engineer_form",{
        state: { consumerNumber },
      });
    } else {
      setError("Invalid consumer number or consumer does not exist.");
    }
  };

  const handleNoConsumer = () => {
    alert("Invalid consumer or consumer does not exist.");
    navigate("/customer/dashboard");
  };

  const handleRemoveSubmission = (index) => {
    setSubmissions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa] relative">
      <Navbar type="customer" />

      {/* Main content area */}
      <div className="flex flex-1 p-6 relative">
        {/* Submission boxes aligned top-left */}
        {submissions.length > 0 && (
          <div className="absolute top-6 left-6 space-y-4 z-10">
            {submissions.map((submission, index) => (
              <div
                key={index}
                className="bg-white shadow-md border border-gray-300 rounded-lg p-4 w-80 relative"
              >
                <button
                  onClick={() => handleRemoveSubmission(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg font-bold"
                >
                  ×
                </button>
                <p className="text-gray-800 font-medium mb-1">
                  {submission.message}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Submitted on: {submission.submittedAt}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    submission.status === "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : submission.status === "Accepted"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Consumer number input — shifts to top-right if submission exists, otherwise centers */}
        <div
          className={`transition-all duration-300 absolute ${
            submissions.length > 0
              ? "top-6 right-6"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <div className="bg-white shadow-md rounded-xl p-8 w-[350px]">
            <h2 className="text-xl font-semibold text-[#01217e] mb-4">
              Schedule Engineer Visit
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
                className="bg-[#01217e] text-white px-4 py-2 rounded-lg hover:bg-[#fcbe03] transition"
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


    </div>
  );
}
