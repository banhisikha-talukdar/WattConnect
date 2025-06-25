import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import LineChart from "../../components/LineChart";
import { interpolationChartData } from "../../assets/fakedata";
import TariffChart from "../../components/TariffChart";

const username = "Customer";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/customer/add");
  };

  // Total Steps Calculation
  const totalStepsByShaan = interpolationChartData.datasets[0].data.reduce(
    (sum, val) => sum + val,
    0
  );
  const totalStepsByShweta = interpolationChartData.datasets[1].data.reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />

      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-black">Hi {username},</h2>
          <p className="text-5xl font-bold text-black mt-1">Welcome back</p>
        </div>

        {/* Add New Button */}
        <button
          onClick={handleAddNew}
          className="absolute top-8 right-8 bg-[#01217e] hover:bg-[#fcbe03] text-white font-medium px-4 py-2 rounded-xl transition"
        >
          Add New
        </button>

        {/* Tariff Chart */}
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md max-w-5xl">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            LT vs HT Tariff Comparison
          </h3>
          <TariffChart />
        </div>

        {/* Container: Summary + Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full flex flex-col md:flex-row gap-6 max-w-5xl">
          {/* Left Column: Total Steps Cards */}
          <div className="flex flex-col gap-6 md:w-1/4">
            <div className="rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-500">Total Steps by Shaan</p>
              <h3 className="text-2xl font-semibold text-gray-700 mt-1">
                {totalStepsByShaan.toLocaleString()} steps
              </h3>
            </div>

            <div className="rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-500">Total Steps by Shweta</p>
              <h3 className="text-2xl font-semibold text-gray-700 mt-1">
                {totalStepsByShweta.toLocaleString()} steps
              </h3>
            </div>
          </div>

          {/* Right Column: Line Chart */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly Steps Trend
            </h3>
            <LineChart />
          </div>
        </div>
      </main>
    </div>
  );
}
