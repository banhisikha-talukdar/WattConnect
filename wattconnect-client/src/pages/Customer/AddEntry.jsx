import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AddEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    type: 'domestic',
    units: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted entry:', formData);
    setFormData({ month: '', year: '', type: 'domestic', units: '' });
  };

  const handleGoBack = () => {
    navigate('/customer/dashboard');
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#9cc7fc] via-white to-[#9cc7fc] justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-xl text-[#01195e] font-semibold text-center">Add New Entry</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Month</label>
          <input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            placeholder="e.g. April"
            required
            className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm"
            placeholder="e.g. 2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Usage Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm"
          >
            <option value="domestic">Domestic</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Units Consumed</label>
          <input
            type="number"
            name="units"
            value={formData.units}
            onChange={handleChange}
            placeholder="e.g. 250"
            required
            className="w-full border-gray-300 rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleGoBack}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Go Back
          </button>
          <button type="submit" className="bg-[#01195e] text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
