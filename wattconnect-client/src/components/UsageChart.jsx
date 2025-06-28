import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import { AuthContext } from "../context/AuthContext";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const processDataByYear = (data) => {
  const yearlyData = {};

  data.forEach((entry) => {
    const { year, month, usageType, unitsUsed } = entry;

    if (!yearlyData[year]) {
      yearlyData[year] = {
        labels: monthOrder,
        domestic: Array(12).fill(0),
        commercial: Array(12).fill(0),
        hasDomestic: false,
        hasCommercial: false,
      };
    }

    const monthIndex = monthOrder.indexOf(month);
    if (usageType.toLowerCase() === "domestic") {
      yearlyData[year].domestic[monthIndex] += unitsUsed;
      yearlyData[year].hasDomestic = true;
    } else if (usageType.toLowerCase() === "commercial") {
      yearlyData[year].commercial[monthIndex] += unitsUsed;
      yearlyData[year].hasCommercial = true;
    }
  });

  return yearlyData;
};

export default function UsageChart() {
  const [usageData, setUsageData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/usage", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsageData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load usage data.");
        setLoading(false);
      });
  }, [token]);

  const yearlyProcessed = processDataByYear(usageData);
  const yearKeys = Object.keys(yearlyProcessed);

  useEffect(() => {
    if (yearKeys.length > 0 && !selectedYear) {
      setSelectedYear(yearKeys[0]); // Default to first year
    }
  }, [yearKeys]);

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading usage data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  if (yearKeys.length === 0) {
    return <p className="text-center text-gray-500 py-4">No usage data available.</p>;
  }

  const selectedData = yearlyProcessed[selectedYear];

  const datasets = [];
  if (selectedData?.hasDomestic) {
    datasets.push({
      label: "Domestic Usage",
      data: selectedData.domestic,
      borderColor: "#3B82F6",
      backgroundColor: "#3B82F6",
      tension: 0.4,
      pointBackgroundColor: "#3B82F6",
    });
  }
  if (selectedData?.hasCommercial) {
    datasets.push({
      label: "Commercial Usage",
      data: selectedData.commercial,
      borderColor: "#F97316",
      backgroundColor: "#F97316",
      tension: 0.4,
      pointBackgroundColor: "#F97316",
    });
  }

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333" },
      },
      title: {
        display: true,
        text: `Monthly Usage for ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#333" },
        title: { display: true, text: "Units" },
      },
      x: {
        ticks: { color: "#333" },
      },
    },
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <label htmlFor="year" className="block text-gray-700 font-medium mb-2">Select Year</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-gray-800"
        >
          {yearKeys.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {datasets.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Line
            data={{
              labels: selectedData.labels,
              datasets,
            }}
            options={baseOptions}
            height={300}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No usage data available for {selectedYear}.</p>
      )}
    </div>
  );
}
