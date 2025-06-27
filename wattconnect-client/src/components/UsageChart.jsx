import { useEffect, useState } from "react";
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
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

// Month order for sorting
const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to aggregate and sort data by usage type
const processData = (data, type) => {
  const aggregated = {};

  data.forEach((entry) => {
    if (entry.usageType === type) {
      if (!aggregated[entry.month]) {
        aggregated[entry.month] = entry.unitsUsed;
      } else {
        aggregated[entry.month] += entry.unitsUsed;
      }
    }
  });

  const sortedMonths = Object.keys(aggregated).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  return {
    labels: sortedMonths,
    dataPoints: sortedMonths.map((month) => aggregated[month]),
  };
};

export default function UsageChart() {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/usage")
      .then((res) => {
        console.log("✅ Usage data fetched:", res.data);
        setUsageData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load usage data", err);
        setError("Failed to load usage data.");
        setLoading(false);
      });
  }, []);

  const domestic = processData(usageData, "domestic");
  const commercial = processData(usageData, "commercial");

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333" },
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

  const domesticChart = {
    labels: domestic.labels,
    datasets: [
      {
        label: "Domestic Usage",
        data: domestic.dataPoints,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
      },
    ],
  };

  const commercialChart = {
    labels: commercial.labels,
    datasets: [
      {
        label: "Commercial Usage",
        data: commercial.dataPoints,
        borderColor: "#F97316",
        backgroundColor: "#F97316",
        tension: 0.4,
        pointBackgroundColor: "#F97316",
      },
    ],
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-4">Loading usage data...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-4">{error}</p>
    );
  }

  return (
    <div className="space-y-12">
      {/* Domestic Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Domestic Usage</h4>
        {domestic.labels.length > 0 ? (
          <Line
            data={domesticChart}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: "Monthly Domestic Usage",
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500">No domestic usage data found.</p>
        )}
      </div>

      {/* Commercial Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">Commercial Usage</h4>
        {commercial.labels.length > 0 ? (
          <Line
            data={commercialChart}
            options={{
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: "Monthly Commercial Usage",
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500">No commercial usage data found.</p>
        )}
      </div>
    </div>
  );
}
