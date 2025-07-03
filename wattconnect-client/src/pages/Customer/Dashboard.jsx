import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import TariffChart from "../../components/TariffChart";
import UsageChart from "../../components/UsageChart";
import BillCalculator from "../../components/BillCalculator";

const username = "Customer";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CustomerDashboard() {
  const navigate = useNavigate();

  // ✅ Add state for month/year
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const handleAddNew = () => {
    navigate("/customer/add");
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3360ab] to-[#84a4da] drop-shadow-lg text-center sm:text-left">
            Hi {username}, Welcome back!
          </h1>

          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 bg-[#01217e] hover:bg-[#fcbe03] text-white font-medium px-6 py-2 rounded-xl transition-all duration-300"
          >
            Add New
          </button>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Bill Estimator
          </h3>
          {/* ✅ Pass selectedMonth and selectedYear */}
          <BillCalculator selectedMonth={selectedMonth} selectedYear={selectedYear} />

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly Usage Overview
            </h3>
            {/* ✅ Pass and set month/year in UsageChart */}
            <UsageChart
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              LT vs HT Tariff Comparison
            </h3>
            <TariffChart />
          </div>
        </div>
      </main>
    </div>
  );
}
