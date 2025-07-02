// ✅ BillCalculator.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function BillCalculator({ selectedMonth, selectedYear }) {
  const [totalUnits, setTotalUnits] = useState(0);
  const [bill, setBill] = useState(null);
  const [details, setDetails] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get user info
        const authRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { _id: userId, category, usageType } = authRes.data;

        // 2️⃣ Get usage data
        const usageRes = await axios.get('http://localhost:5000/api/usage', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usageData = usageRes.data;

        // 3️⃣ Filter for user + usageType
        const userUsage = usageData.filter(
          (entry) => entry.userId === userId && entry.usageType === usageType
        );

        // 4️⃣ Filter for selected month & year
        const filteredUsage = userUsage.filter((entry) => {
          const date = new Date(entry.date);
          return (
            date.getMonth() + 1 === selectedMonth &&
            date.getFullYear() === selectedYear
          );
        });

        // 5️⃣ Aggregate daily usage: create map
        const unitsByDate = {};
        filteredUsage.forEach((entry) => {
          const date = new Date(entry.date);
          const key = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
          unitsByDate[key] = (unitsByDate[key] || 0) + entry.unitsUsed;
        });

        // 6️⃣ Fill missing days, calculate total units
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        let total = 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const key = `${String(day).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;
          total += unitsByDate[key] || 0;
        }

        setTotalUnits(total);

        // 7️⃣ Get tariffs
        const tariffRes = await axios.get('http://localhost:5000/api/tariffs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tariffs = tariffRes.data;

        // 8️⃣ Match category
        const matchingTariffs = tariffs.filter(t => t.category === category);

        let selectedTariff = null;

        for (let t of matchingTariffs) {
          if (t.unitRange && t.unitRange.length === 2) {
            const [min, max] = t.unitRange;
            if (total >= min && total <= max) {
              selectedTariff = t;
              break;
            }
          }
        }

        // Fallback to first match if no unitRange matched
        if (!selectedTariff && matchingTariffs.length > 0) {
          selectedTariff = matchingTariffs[0];
        }

        // 9️⃣ Calculate bill based on available data
        let finalBill = null;
        let formula = '';
        if (selectedTariff) {
          const {
            fixedCharge,
            effectiveRate,
            energyCharge,
            subsidyTariff,
            subCategory,
            type
          } = selectedTariff;

          const hasFixed = typeof fixedCharge === 'number';
          const hasEffRate = typeof effectiveRate === 'number';
          const hasEnergy = typeof energyCharge === 'number';

          if (hasFixed && hasEffRate) {
            finalBill = total * effectiveRate + fixedCharge;
            formula = `TotalUnits * EffectiveRate + FixedCharge`;
          } else if (hasFixed && hasEnergy) {
            finalBill = total * energyCharge + fixedCharge;
            formula = `TotalUnits * EnergyCharge + FixedCharge`;
          } else {
            console.warn("❌ Missing required tariff data for billing");
          }

          if (finalBill !== null) {
            if (!isNaN(finalBill)) {
              setBill(finalBill.toFixed(2));
            }
            setDetails({
              subCategory,
              type,
              fixedCharge,
              totalUnits: total,
              rateUsed: hasEffRate ? effectiveRate : energyCharge,
              formula,
            });
          }
        }
      } catch (err) {
        console.error("❌ Error calculating bill:", err);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, token]);

  return (
    <div className="p-4 border rounded-xl bg-white shadow-md text-gray-800">
      <h2 className="text-2xl font-bold mb-2">
        📅 {String(selectedMonth).padStart(2, '0')}-{selectedYear}
      </h2>
      {bill && !isNaN(Number(bill)) ? (
        <p className="text-xl text-green-700">💸 Bill: ₹<strong>{bill}</strong></p>
      ) : (
        <p className="text-red-600">⚠️ Bill could not be calculated.</p>
      )}
    </div>
  );
}
