import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function ViewBill({ selectedMonth, selectedYear }) {
  const { token } = useContext(AuthContext);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !selectedMonth || !selectedYear) {
      setError("Invalid selection or authentication.");
      return;
    }

    const monthIndex = months.indexOf(selectedMonth); // 0-based index
    const yearNum = parseInt(selectedYear);

    if (monthIndex === -1 || isNaN(yearNum)) {
      setError("Invalid month or year.");
      return;
    }

    axios.post("http://localhost:5000/api/usage/calculate-bill", {
      month: monthIndex,
      year: yearNum,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setBill(res.data);
      setError("");
    })
    .catch((err) => {
      console.error("Bill fetch error", err);
      setError("Could not load bill");
    });
  }, [token, selectedMonth, selectedYear]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!bill) return <p className="text-gray-500 text-center mt-4">Loading your bill...</p>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold text-center text-[#226c82] mb-4">
        Your Bill for {selectedMonth} {selectedYear}
      </h2>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Total Units:</strong> {bill.total_units ?? 0} kWh</li>
        <li><strong>Energy Charge:</strong> ₹{bill.energy_charge?.toFixed(2) ?? "0.00"}</li>
        <li><strong>FPPPA:</strong> ₹{bill.fpppa?.toFixed(2) ?? "0.00"}</li>
        <li><strong>Fixed Charge:</strong> ₹{bill.fixed_charge?.toFixed(2) ?? "0.00"}</li>
        <li><strong>Electricity Duty:</strong> ₹{bill.duty?.toFixed(2) ?? "0.00"}</li>
        <li className="font-bold text-lg mt-2">
          <strong>Total Bill:</strong> ₹{bill.total_bill?.toFixed(2) ?? "0.00"}
        </li>
      </ul>
    </div>
  );
}
