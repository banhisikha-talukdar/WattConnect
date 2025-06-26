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
          formData: state.formData || null,
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
    <div className="flex min-h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <Navbar type="customer" />
      </div>

      {/* Main area */}
      <div className="flex-1 p-4 md:p-6 relative flex flex-col md:flex-row gap-6">
        {/* Submissions - left aligned */}
        {submissions.length > 0 && (
          <div className="space-y-4 w-full md:w-[22rem] overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white shadow-md border border-gray-300 rounded-lg p-4"
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

        {/* Consumer Input - right aligned or centered if no submissions */}
          <div className={`flex w-full ${submissions.length === 0
            ? "justify-center items-center min-h-[70vh]"
            : "justify-end items-start"
          }`}>
          <div className="w-full max-w-sm bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#01217e] mb-4">
              Schedule Engineer Visit
            </h2>
            <label className="block text-gray-700 mb-2">
              Enter 12-digit Consumer Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                maxLength={12}
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
