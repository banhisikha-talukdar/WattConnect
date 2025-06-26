import { useState } from "react";
import axios from "axios";

export default function MeterForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
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
      alert("Meter schedule submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white rounded-xl shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Meter Installation Visit Form</h2>
      <input
        name="consumerNumber"
        placeholder="12-digit Consumer Number"
        maxLength={12}
        required
        onChange={handleChange}
        className="input"
      />
      <input
        name="district"
        placeholder="District"
        required
        onChange={handleChange}
        className="input"
      />
      <input
        name="subdivision"
        placeholder="Subdivision (City/Town)"
        required
        onChange={handleChange}
        className="input"
      />
      <input
        name="applicantName"
        placeholder="Name of Applicant"
        required
        onChange={handleChange}
        className="input"
      />
      <input
        name="address"
        placeholder="Address"
        required
        onChange={handleChange}
        className="input"
      />
      <input
        type="date"
        name="preferredDate"
        required
        onChange={handleChange}
        className="input"
      />
      <select name="usageType" onChange={handleChange} className="input">
        <option value="domestic">Domestic</option>
        <option value="commercial">Commercial</option>
      </select>
      <textarea
        name="reason"
        placeholder="Write your reason for scheduling the visit..."
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
}
