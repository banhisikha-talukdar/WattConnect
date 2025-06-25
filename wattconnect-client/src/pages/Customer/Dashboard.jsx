import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import TariffChart from "../../components/TariffChart";

const username = "Customer";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/customer/add");
  };

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

      </main>
    </div>
  );
}
