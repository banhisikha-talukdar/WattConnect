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

// Process data grouped by year
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

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading usage data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  const yearlyProcessed = processDataByYear(usageData);
  const yearKeys = Object.keys(yearlyProcessed);

  if (yearKeys.length === 0) {
    return <p className="text-center text-gray-500 py-4">No usage data available.</p>;
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
        text: "",
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
    <div className="space-y-12">
      {yearKeys.map((year) => {
        const yearData = yearlyProcessed[year];

        // If both types are missing, skip chart rendering
        if (!yearData.hasDomestic && !yearData.hasCommercial) {
          return null;
        }

        const datasets = [];
        if (yearData.hasDomestic) {
          datasets.push({
            label: "Domestic Usage",
            data: yearData.domestic,
            borderColor: "#3B82F6",
            backgroundColor: "#3B82F6",
            tension: 0.4,
            pointBackgroundColor: "#3B82F6",
          });
        }
        if (yearData.hasCommercial) {
          datasets.push({
            label: "Commercial Usage",
            data: yearData.commercial,
            borderColor: "#F97316",
            backgroundColor: "#F97316",
            tension: 0.4,
            pointBackgroundColor: "#F97316",
          });
        }

        return (
          <div
            key={year}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto"
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              Electricity Usage - {year}
            </h4>
            <Line
              data={{
                labels: yearData.labels,
                datasets,
              }}
              options={{
                ...baseOptions,
                plugins: {
                  ...baseOptions.plugins,
                  title: {
                    display: true,
                    text: `Monthly Usage for ${year}`,
                  },
                },
              }}
              height={300}
            />
          </div>
        );
      })}
    </div>
  );
}
