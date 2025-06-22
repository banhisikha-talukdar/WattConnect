import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScheduleMyEngineerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    district: "",
    subdivision: "",
    name: "",
    address: "",
    purpose: "domestic",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedAt = new Date().toLocaleString();
    navigate("/customer/my_engineer_scheduling", {
      state: {
        message: "Engineer visit form submitted successfully!",
        submittedAt,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f6fc] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Engineer Visit Form
        </h2>

        {/* Form fields remain unchanged */}
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="subdivision"
          placeholder="Subdivision (City/Town)"
          value={formData.subdivision}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="name"
          placeholder="Name of Applicant"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="domestic">Domestic</option>
          <option value="commercial">Commercial</option>
        </select>

        <textarea
          name="reason"
          placeholder="Write your reason for scheduling the visit..."
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          required
          className="w-full p-2 border rounded-lg resize-none"
        />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Schedule It
        </button>
      </form>
    </div>
  );
}
