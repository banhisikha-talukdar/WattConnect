import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MeterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    consumerNumber: "",
    district: "",
    subdivision: "",
    applicantName: "",
    address: "",
    preferredDate: "",
    usageType: "domestic",
    reason: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/schedule/meter",
        {
          ...formData,
          formType: "meter",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Meter installation visit schedule request done successfully!");
      onSuccess(formData);
    } catch (err) {
      console.error("❌ Submission error:", err.response?.data || err.message);
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#01217e] mb-2">
        Meter Installation Visit Scheduling Form
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="consumerNumber"
          placeholder="12-digit Consumer Number"
          maxLength={12}
          required
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="district"
          placeholder="District"
          required
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="subdivision"
          placeholder="Subdivision (City/Town)"
          required
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="applicantName"
          placeholder="Name of Applicant"
          required
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="address"
          placeholder="Address"
          required
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-full"
        />

        <input
          type="date"
          name="preferredDate"
          required
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="usageType"
          value={formData.usageType}
          onChange={handleChange}
          className="w-sm border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="domestic">Domestic</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      <textarea
        name="reason"
        placeholder="Reason for scheduling the visit..."
        required
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      <div className="text-center mt-4 flex justify-center gap-4">
        <button
          type="submit"
          className="bg-[#01217e] hover:bg-[#fcbe03] text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Submit Request
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-500 text-black font-semibold px-6 py-2 rounded-lg transition"
        >
          ← Go Back
        </button>
      </div>
    </form>
  );
}
