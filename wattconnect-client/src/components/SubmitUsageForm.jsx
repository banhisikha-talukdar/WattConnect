import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SubmitUsageForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [unitsUsed, setUnitsUsed] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !year || !unitsUsed) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/usage",
        { month, year: Number(year), unitsUsed: Number(unitsUsed) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Usage submitted:", res.data);
      navigate("/customer/dashboard");
    } catch (err) {
      console.error("❌ Submission failed:", err.response?.data || err.message);
      alert("Failed to submit usage data.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-2xl w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Submit Usage</h2>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Month</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
            (m) => (
              <option key={m} value={m}>
                {m}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          placeholder="Year (e.g. 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          placeholder="Units Used"
          value={unitsUsed}
          onChange={(e) => setUnitsUsed(e.target.value)}
          required
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
