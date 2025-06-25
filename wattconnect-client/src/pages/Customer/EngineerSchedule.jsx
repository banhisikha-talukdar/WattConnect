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
  const hasAddedSubmission = useRef(false);

  useEffect(() => {
  if (state?.message && !hasAddedSubmission.current) {
    setSubmissions((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: state.message,
        submittedAt: state.submittedAt,
        status: "Pending",
        formData: state.formData || null, // ⬅️ include form details
      },
    ]);

    hasAddedSubmission.current = true;
    navigate(location.pathname, { replace: true, state: {} });
  }
  }, [state, navigate, location.pathname]);

  const handleNext = () => {
    if (/^\d{12}$/.test(consumerNumber)) {
      navigate("/customer/schedule_my_engineer_form", {
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

  const handleCancelSchedule = (id) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              status: "Cancelled",
              message: "Engineer visit cancelled.",
            }
          : submission
      )
    );
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa] relative">
      <Navbar type="customer" />

      {/* Main content area */}
      <div className="flex flex-1 p-6 relative">
        {/* Submission boxes aligned top-left */}
        {submissions.length > 0 && (
          <div className="absolute top-6 left-6 space-y-4 z-10">
            {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white shadow-md border border-gray-300 rounded-lg p-4 w-80 relative"
            >
              <p className="text-gray-800 font-medium mb-1">
                {submission.message}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Submitted on: {submission.submittedAt}
              </p>

              {submission.formData && (
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Name:</strong> {submission.formData.name}</p>
                  <p><strong>District:</strong> {submission.formData.district}</p>
                  <p><strong>Subdivision:</strong> {submission.formData.subdivision}</p>
                  <p><strong>Address:</strong> {submission.formData.address}</p>
                  <p><strong>Purpose:</strong> {submission.formData.purpose}</p>
                  <p><strong>Reason:</strong> {submission.formData.reason}</p>
                  <p><strong>Preferred Date:</strong> {submission.formData.preferredDate}</p>
                </div>
              )}

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                  submission.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : submission.status === "Accepted"
                    ? "bg-green-200 text-green-800"
                    : submission.status === "Rejected"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {submission.status}
              </span>

              {submission.status === "Pending" && (
                <button
                  onClick={() => handleCancelSchedule(submission.id)}
                  className="mt-3 text-sm bg-red-400 px-3 py-1 rounded-md text-white font-medium hover:bg-red-600"
                >
                  Cancel Schedule
                </button>
              )}
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
