// src/data/FakeData.js
export const interpolationChartData = {
  labels: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  datasets: [
    {
      label: "Steps_by_shaan",
      data: [30000, 51100, 45900, 60000, 29000, 70000, 54000, 30000, 47000, 50000, 79000, 56000],
      borderColor: "rgb(149, 235, 92)",
      fill: false,
      tension: 0.4, // makes the line smooth
    },
    {
      label: "Steps_by_Shweta",
      data: [25000, 47000, 39000, 21000, 56000, 30000, 55000, 45000, 60000, 77000, 63000, 84000],
      borderColor: "rgb(230, 61, 112)",
      fill: false,
      tension: 0.4, // smooth line
    },
  ],
};
