import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BillCalculator({ selectedYear, selectedMonth }) {
  const [monthlyBill, setMonthlyBill] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Replace with actual token logic

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1️⃣: Get user data (category, usageType)
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { _id: userId, category, usageType } = userRes.data;

        // Step 2️⃣: Get usage data
        const usageRes = await axios.get('http://localhost:5000/api/usage', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentMonth = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ].indexOf(selectedMonth);

        const currentYear = Number(selectedYear);

        const usageThisMonth = usageRes.data.filter((entry) => {
          const date = new Date(entry.date);
          return (
            entry.customer === userId &&                // ✅ filter by customer ID
            entry.usageType === usageType &&            // ✅ filter by usage type
            date.getMonth() === currentMonth &&         // ✅ filter by month
            date.getFullYear() === currentYear          // ✅ filter by year
          );
        });


        // Step 3️⃣: Calculate total units used
        const totalUnits = usageThisMonth.reduce((sum, entry) => sum + entry.unitsUsed, 0);

        // Step 4️⃣: Get tariff data
        const tariffRes = await axios.get('http://localhost:5000/api/tariffs');
        const tariffData = tariffRes.data;

        // Step 5️⃣: Match correct tariff slab
        const matchingSlab = tariffData.find((item) => {
          if (item.category !== category) return false;
          if (item.unitRange) {
            const [min, max] = item.unitRange;
            return totalUnits >= min && totalUnits <= max;
          }
          return true; // if no unitRange, match only by category
        });

        if (!matchingSlab) {
          setMonthlyBill("❌ No matching tariff slab found.");
          return;
        }

        // Step 6️⃣: Extract data and compute bill
        const {
          subCategory,
          fixedCharge = 0,
          energyCharge = 0,
          subsidyTargeted = 0,
          subsidyTariff = 0,
        } = matchingSlab;

        const totalSubsidy = subsidyTargeted + subsidyTariff;
        const effectiveRate = energyCharge - totalSubsidy;
        const bill = totalUnits * effectiveRate + fixedCharge;

        setDetails({
          subCategory: subCategory || "N/A",
          fixedCharge,
          energyCharge,
          subsidyTargeted,
          subsidyTariff,
          totalSubsidy,
          effectiveRate,
          totalMonthlyUnits: totalUnits,
        });

        setMonthlyBill(bill.toFixed(2));
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to fetch or process billing data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">📊 Monthly Bill Estimate</h2>

      {error && <p className="text-red-600">{error}</p>}

      {details ? (
        <>
          <p><strong>Total Units Used:</strong> {details.totalMonthlyUnits} kWh</p>
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <p className="text-lg font-semibold text-green-700">
              💡 Estimated Current Bill: ₹{monthlyBill}
            </p>

            <div className="mt-3 text-sm space-y-1 text-gray-700">
              <p><strong>Slab:</strong> {details.subCategory}</p>
              <p><strong>Energy Charge:</strong> ₹{details.energyCharge}</p>
              <p><strong>Subsidy Tariff:</strong> ₹{details.subsidyTariff}</p>
              <p><strong>Subsidy Targeted:</strong> ₹{details.subsidyTargeted}</p>
              <p><strong>Total Subsidy:</strong> ₹{details.totalSubsidy}</p>
              <p><strong>Effective Rate:</strong> ₹{details.effectiveRate.toFixed(2)}</p>
              <p><strong>Fixed Monthly Charge:</strong> ₹{details.fixedCharge}</p>
            </div>
          </div>
        </>
      ) : !error ? (
        <p className="text-blue-600 mt-4">Fetching data and calculating bill...</p>
      ) : null}
    </div>
  );
}
