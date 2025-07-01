import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SubmitUsageForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [unitsUsed, setUnitsUsed] = useState("");
  const [usageType, setUsageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !unitsUsed || !usageType) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/usage",
        { date, unitsUsed: Number(unitsUsed), usageType },
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
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-8 rounded-2xl w-full max-w-md flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-[#226c82]">Submit Usage</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#226c82]"
      />

      <input
        type="number"
        placeholder="Units Used"
        value={unitsUsed}
        onChange={(e) => setUnitsUsed(e.target.value)}
        required
        min="0"
        className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#226c82]"
      />

      <select
        value={usageType}
        onChange={(e) => setUsageType(e.target.value)}
        required
        className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#226c82]"
      >
        <option value="">Select Usage Type</option>
        <option value="domestic">Domestic</option>
        <option value="commercial">Commercial</option>
      </select>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/customer/dashboard")}
          className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 rounded transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 bg-[#226c82] hover:bg-[#f0920f] text-white font-semibold py-2 rounded transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
