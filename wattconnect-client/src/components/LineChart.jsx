// src/components/LineChart.jsx
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { interpolationChartData } from "../assets/fakedata"; // adjust path as needed

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Steps',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Month',
      },
    },
  },
};

export default function LineChart() {
  return <Line data={interpolationChartData} options={options} />;
}
