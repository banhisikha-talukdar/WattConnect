import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function MeterSchedule() {
  const [consumerNumber, setConsumerNumber] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  // When redirected from the form with new submission, pre-fill consumer number
  useEffect(() => {
    if (state?.formData?.consumerNumber) {
      setConsumerNumber(state.formData.consumerNumber);
    }
  }, [state]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!consumerNumber) return;

      try {
        const result = await axios.get("/api/schedule", {
          params: {
            type: "meter",
            consumerNumber: consumerNumber,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // 🛠️ Fix: ensure result.data is an array
        const responseData = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data.data)
          ? result.data.data
          : [];

        const filtered = responseData.filter(
          (item) => item.status === "Pending"
        );

        // If a new form was just submitted (from EngineerForm), show it too
        if (state?.formData) {
          const newSubmission = {
            id: Date.now(),
            message: "Submitted successfully",
            submittedAt: new Date().toLocaleString(),
            status: "Pending",
            formData: state.formData,
            consumerNumber: state.formData.consumerNumber,
          };

          // Avoid duplication
          const isDuplicate = filtered.some(
            (item) =>
              item.formData?.consumerNumber === newSubmission.formData.consumerNumber &&
              item.formData?.preferredDate === newSubmission.formData.preferredDate
          );

          setSubmissions(isDuplicate ? filtered : [newSubmission, ...filtered]);
        } else {
          setSubmissions(filtered);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [consumerNumber, state]);

  const handleNext = () => {
    if (/^\d{12}$/.test(consumerNumber)) {
      navigate("/customer/schedule_my_meter_form", {
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f4f6fa]">
      <div className="w-full lg:w-64 shrink-0">
        <Navbar type="customer" />
      </div>

      <div className="flex-1 px-4 md:px-8 py-6">
        <div className="max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-semibold text-center text-[#01217e] mb-2">
            Schedule Meter Installation Visit
          </h2>
          <label className="block text-center text-gray-700 mb-2">
            Enter 12-digit Consumer Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="text"
              maxLength={12}
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="flex-1 border bg-white border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 123456789012"
            />
            <button
              onClick={handleNext}
              className="bg-[#01217e] text-white px-4 py-2 rounded-lg hover:bg-[#fcbe03] transition"
            >
              Next
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <div className="text-center mt-2">
            <button
              onClick={handleNoConsumer}
              className="text-sm text-blue-600 hover:underline"
            >
              I don’t have consumer number
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white shadow-md border border-gray-300 rounded-lg p-4"
            >
              <p className="text-gray-800 font-medium mb-1">
                {submission.message || "Submitted request"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Submitted on: {submission.submittedAt}
              </p>

              {submission.formData && (
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Name:</strong> {submission.formData.applicantName}</p>
                  <p><strong>District:</strong> {submission.formData.district}</p>
                  <p><strong>Subdivision:</strong> {submission.formData.subdivision}</p>
                  <p><strong>Address:</strong> {submission.formData.address}</p>
                  <p><strong>Purpose:</strong> {submission.formData.usageType}</p>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
