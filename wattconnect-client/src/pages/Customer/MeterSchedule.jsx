import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";

export default function MeterSchedule() {
  const [consumerNumber, setConsumerNumber] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [userConsumerNumber, setUserConsumerNumber] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const { state } = location;

  //Fetch authenticated user's consumer number
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserConsumerNumber(res.data.consumerNumber || null);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch all meter submissions and filter by logged-in user's consumer number
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!userConsumerNumber) return;

      try {
        const result = await axios.get("http://localhost:5000/api/schedule", {
          params: {
            type: "meter",
            consumerNumber: userConsumerNumber,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = Array.isArray(result.data) ? result.data : [];
        setSubmissions(responseData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [userConsumerNumber, token]);

  const handleNext = () => {
    if (!/^\d{12}$/.test(consumerNumber)) {
      setError("Invalid consumer number format.");
      return;
    }

    if (!userConsumerNumber) {
      setError("You don't have a registered consumer number.");
      return;
    }

    if (String(consumerNumber) !== String(userConsumerNumber)) {
      setError("Entered consumer number does not match your account.");
      return;
    }

    navigate("/customer/schedule-my-meter-form", {
      state: { consumerNumber },
    });
  };

  const handleNoConsumer = () => {
    navigate("/customer/new-application");
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />

      <main className="flex-1 px-4 sm:px-8 pt-20 pb-10 overflow-y-auto">
        {/* Header + Input Form Section */}
        <div className="w-full max-w-md mx-auto mb-6 sm:mb-10 sm:bg-white sm:p-8 p-4 bg-transparent sm:rounded-2xl sm:shadow-md shadow-none">
          <h2 className="text-2xl font-bold text-[#01217e] mb-4 text-center">
            Schedule Meter Installation Visit
          </h2>

          <label className="block text-gray-700 mb-2 text-center">
            Enter your 12-digit Consumer Number
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              maxLength={12}
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="w-full sm:flex-1 border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 123456789012"
            />
            <button
              onClick={handleNext}
              className="bg-[#01217e] text-white px-5 py-2 rounded-lg hover:bg-[#fcbe03] transition duration-300"
            >
              Next
            </button>
          </div>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <div className="text-center mt-3">
            <button
              onClick={handleNoConsumer}
              className="text-sm text-blue-600 hover:underline"
            >
              I don’t have a consumer number
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        {submissions.length > 0 && (
          <div className="max-w-7xl mx-auto overflow-x-auto">
            <h3 className="text-xl font-semibold text-[#01217e] mb-4 text-center">
              Your Submitted Meter Installation Requests
            </h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Usage Type</th>
                  <th className="py-3 px-4 border-b text-left">Reason</th>
                  <th className="py-3 px-4 border-b text-left">Preferred Date</th>
                  <th className="py-3 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission._id || index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border-gray-200">
                      {submission.usageType ?? "N/A"}
                    </td>
                    <td className="py-3 px-4 border-gray-200">
                      {submission.reason ?? "N/A"}
                    </td>
                    <td className="py-3 px-4 border-gray-200">
                      {submission.preferredDate
                        ? new Date(submission.preferredDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 border-gray-200">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full inline-block
                          ${
                            submission.status === "Pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : submission.status === "Accepted"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}