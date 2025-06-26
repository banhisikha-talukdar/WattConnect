import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function UsageChart() {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/usage') 
    .then((res)=>{
      console.log("✅ Usages fetched:", res.data);
        setUsageData(res.data);
      })
      .catch((err) => console.error("❌ Failed to load usage data", err));
  }, []);


  const labels = usageData.map((entry) => entry.month);
  const dataPoints = usageData.map((entry) => entry.unitsUsed);

  const data = {
    labels,
    datasets: [
      {
        label: 'Units Used',
        data: dataPoints,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#3B82F6',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Monthly Electricity Usage',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#333' },
        title: { display: true, text: 'Units' },
      },
      x: {
        ticks: { color: '#333' },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
      {usageData.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-center text-gray-500">Loading usage data...</p>
      )}
    </div>
  );
}
