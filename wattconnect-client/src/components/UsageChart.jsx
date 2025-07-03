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

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDateLabel(dateStr) {
  const [dd, mm] = dateStr.split("-");
  const day = parseInt(dd);
  const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][parseInt(mm) - 1] || "???";

  const suffix = (d) =>
    d === 1 || d === 21 || d === 31 ? "st" :
    d === 2 || d === 22 ? "nd" :
    d === 3 || d === 23 ? "rd" : "th";

  return `${day}${suffix(day)} ${monthShort}`;
}

function getAllDaysInMonth(year, monthName) {
  const month = months.indexOf(monthName);
  if (month === -1 || !year) return [];
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(month + 1).padStart(2, "0");
    const y = date.getFullYear();
    dates.push(`${d}-${m}-${y}`);
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export default function UsageChart() {
  const { token } = useContext(AuthContext);
  const [usageData, setUsageData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!selectedYear) {
    const currentYear = new Date().getFullYear();
    setSelectedYear(String(currentYear));
  }

  if (!selectedMonth) {
    const currentMonthIndex = new Date().getMonth();
    setSelectedMonth(months[currentMonthIndex]);
  }
}, [selectedYear, selectedMonth]);


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
        const enriched = res.data.map((entry) => {
          const dateObj = new Date(entry.date);
          const year = dateObj.getFullYear();
          const month = months[dateObj.getMonth()];
          const dd = String(dateObj.getDate()).padStart(2, "0");
          const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
          const yyyy = dateObj.getFullYear();
          const formattedDate = `${dd}-${mm}-${yyyy}`;

          return {
            ...entry,
            year,
            month,
            formattedDate,
          };
        });

        setUsageData(enriched);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load usage data.");
        setLoading(false);
      });
  }, [token]);

  const years = Array.from(new Set(usageData.map((entry) => entry.year))).sort();

  const filteredData = usageData.filter(
    (entry) =>
      String(entry.year) === String(selectedYear) &&
      entry.month === selectedMonth
  );

  const allDates = getAllDaysInMonth(Number(selectedYear), selectedMonth);
  const groupedData = {};

  filteredData.forEach(({ formattedDate, unitsUsed, usageType }) => {
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = { domestic: 0, commercial: 0 };
    }

    const units = parseFloat(unitsUsed);
if (!isNaN(units)) {
  groupedData[formattedDate][usageType.toLowerCase()] = units;
}

  });

  const domesticData = allDates.map((date) => {
  const val = groupedData[date]?.domestic;
  return !isNaN(val) ? val : 0;
});

const commercialData = allDates.map((date) => {
  const val = groupedData[date]?.commercial;
  return !isNaN(val) ? val : 0;
});


  const labels = allDates.map((d) => formatDateLabel(d));

  const datasets = [];
  if (domesticData.some((v) => v > 0)) {
    datasets.push({
      label: "Domestic",
      data: domesticData,
      borderColor: "#3B82F6",
      tension: 0.3,
      fill: false,
    });
  }
  if (commercialData.some((v) => v > 0)) {
    datasets.push({
      label: "Commercial",
      data: commercialData,
      borderColor: "#F97316",
      tension: 0.3,
      fill: false,
    });
  }

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { beginAtZero: true, title: { display: true, text: "Units" } },
    },
  };

  if (loading) return <p className="text-center py-4 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#226c82] text-center">
        Monthly Usage Chart
      </h2>
        <select
  value={selectedYear || ""}
  onChange={(e) => setSelectedYear(e.target.value)}
  className="border border-gray-300 px-4 py-2 rounded"
>
  {years.map((year, index) => (
    <option key={index} value={String(year)}>{String(year)}</option>
  ))}
</select>

<select
  value={selectedMonth || ""}
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="border border-gray-300 px-4 py-2 rounded"
>
  {months.map((month, index) => (
    <option key={index} value={month}>{month}</option>
  ))}
</select>


      {datasets.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p className="text-center text-gray-500">No usage data for selected month.</p>
      )}
    </div>
  );
}
