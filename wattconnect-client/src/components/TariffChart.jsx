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
        setTariffs(res.data);
      })
      .catch((err) => console.error("❌ Failed to load tariff data", err));
  }, []);

  const ltTariffs = tariffs.filter((t) => t.type === "LT");
  const htTariffs = tariffs.filter((t) => t.type === "HT");

  const allTariffs = [...ltTariffs, ...htTariffs];

  const labels = allTariffs.map((t) =>
    typeof t.category === "string" ? `${t.type}: ${t.category}` : `${t.type}: Unknown`
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Effective Rate (₹/kWh)",
        data: allTariffs.map((t) =>
          typeof t.effectiveRate === "number" ? t.effectiveRate : 0
        ),
        backgroundColor: allTariffs.map((t) =>
          t.type === "HT" ? "rgba(255,99,132,0.7)" : "rgba(54,162,235,0.7)"
        ),
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">LT vs HT Tariff Comparison</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const t = allTariffs[index];
                  return [
                    `Effective Rate: ₹${t.effectiveRate?.toFixed(2)}`,
                    `Fixed Charge: ₹${t.fixedCharge ?? 'N/A'}`,
                    `Energy Charge: ₹${t.energyCharge ?? 'N/A'}`,
                  ];
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "₹ per kWh",
              },
              beginAtZero: true,
            },
            x: {
              ticks: {
                callback: (val, index, ticks) => {
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
