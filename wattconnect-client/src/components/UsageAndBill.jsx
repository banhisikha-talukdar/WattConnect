import { useState } from "react";
import UsageChart from "./UsageChart";
import BillCalculator from "./BillCalculator";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function UsageAndBill() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <div className="space-y-12">
      <UsageChart
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <BillCalculator selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </div>
  );
}
