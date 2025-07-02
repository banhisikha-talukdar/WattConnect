import { useState } from "react";
import UsageChart from "./UsageChart";
import BillCalculator from "./BillCalculator";

export default function UsageAndBill() {
  const [selectedYear, setSelectedYear] = useState(""); // set default dynamically in UsageChart
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <div className="flex flex-col gap-10 p-6">
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
