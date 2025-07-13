import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TariffChart from "../../components/TariffChart";
import UsageChart from "../../components/UsageChart";
import ViewBill from "../../components/ViewBill";
import Chatbot from "../../components/Chatbot";

const username = "Customer";

export default function CustomerDashboard() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/customer/add");
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        {/* Top Section: Greeting + Add Button */}
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

        <div>
          <ViewBill selectedMonth={selectedMonth} selectedYear={selectedYear} />
        </div>

        <br />

        {/* Charts Section */}
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Usage Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly Usage Overview
            </h3>
            <UsageChart
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </div>

          {/* Tariff Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              LT vs HT Tariff Comparison
            </h3>
            <TariffChart />
          </div>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
