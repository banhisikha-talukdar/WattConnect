import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

export default function LtHtTariffChart() {
  const [tariffs, setTariffs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tariffs")
      .then((res) => {
        console.log("✅ Tariffs fetched:", res.data);
        setTariffs(res.data);
      })
      .catch((err) => console.error("❌ Failed to load tariff data", err));
  }, []);

  const ltTariffs = tariffs.filter((t) => t.type === "LT");
  const htTariffs = tariffs.filter((t) => t.type === "HT");

  const ltLabels = ltTariffs.map((t) =>
    typeof t.category === "string" ? `LT: ${t.category}` : "LT: Unknown"
  );
  const htLabels = htTariffs.map((t) =>
    typeof t.category === "string" ? `HT: ${t.category}` : "HT: Unknown"
  );

  const chartData = {
    labels: [...ltLabels, ...htLabels],
    datasets: [
      {
        label: "Effective Rate (₹/kWh)",
        data: [...ltTariffs, ...htTariffs].map((t) =>
          typeof t.effectiveRate === "number" ? t.effectiveRate : 0
        ),
        backgroundColor: [
          ...ltTariffs.map(() => "rgba(54,162,235,0.7)"),
          ...htTariffs.map(() => "rgba(255,99,132,0.7)"),
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        LT vs HT Tariff Comparison
      </h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
          },
          scales: {
            y: {
              title: { display: true, text: "₹ per kWh" },
              beginAtZero: true,
            },
            x: {
              ticks: {
                callback: function (value, index, ticks) {
                  const label = chartData.labels[index];
                  return typeof label === "string" && label.length > 20
                    ? label.substring(0, 20) + "…"
                    : label;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
