import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BillCalculator({ selectedYear, selectedMonth }) {
  const [totalUnits, setTotalUnits] = useState(0);
  const [bill, setBill] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null); // 🔧 This fixes the error
  const { token } = useContext(AuthContext);

  const monthIndex = months.indexOf(selectedMonth) + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        let authRes;
        try {
          authRes = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          setError("Failed to fetch user details.");
          return;
        }

        const { _id: userId, category, usageType } = authRes.data || {};
        if (!userId || !category || !usageType) {
          setError("User data incomplete (missing category or usageType).");
          return;
        }

        // Fetch usage
        let usageRes;
        try {
          usageRes = await axios.get('http://localhost:5000/api/usage', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          setError("Failed to fetch usage data.");
          return;
        }
        const usageData = usageRes.data || [];

        const userUsage = usageData.filter(
          (entry) => entry.userId === userId && entry.usageType === usageType
        );
        if (userUsage.length === 0) {
          setError("No usage data found for this user.");
          return;
        }

        // Filter usage by month/year
        const filteredUsage = userUsage.filter((entry) => {
          const date = new Date(entry.date);
          return (
            date.getMonth() + 1 === monthIndex &&
            date.getFullYear() === Number(selectedYear)
          );
        });

        const unitsByDate = {};
        filteredUsage.forEach((entry) => {
          const date = new Date(entry.date);
          const key = `${String(date.getDate()).padStart(2, '0')}-${String(monthIndex).padStart(2, '0')}-${date.getFullYear()}`;
          unitsByDate[key] = (unitsByDate[key] || 0) + entry.unitsUsed;
        });

        const daysInMonth = new Date(selectedYear, monthIndex, 0).getDate();
        let total = 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const key = `${String(day).padStart(2, '0')}-${String(monthIndex).padStart(2, '0')}-${selectedYear}`;
          total += unitsByDate[key] || 0;
        }

        setTotalUnits(total);

         // Fetch tariff data
        let tariffRes;
        try {
          tariffRes = await axios.get('http://localhost:5000/api/tariffs', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          setError("Failed to fetch tariff data.");
          return;
        }
        const tariffs = tariffRes.data || [];

        const matchingTariffs = tariffs.filter(t => t.category === category);
         if (matchingTariffs.length === 0) {
          setError(`No tariff found for category: ${category}`);
          return;
        }
        
        // Step 1: Select correct tariff based on unit range if available
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

        // Step 2: Fallback - if no unitRange match, pick best available match
        if (!selectedTariff && matchingTariffs.length > 0) {
          // Prefer tariff with either effectiveRate or energyCharge
          selectedTariff = matchingTariffs.find(t =>
            !isNaN(parseFloat(t.effectiveRate)) || !isNaN(parseFloat(t.energyCharge))
          ) || matchingTariffs[0]; // Fallback to first
        }

        let finalBill = null;
        let formula = '';
        if (selectedTariff) {
          const {
            subCategory = 'N/A',
            type = 'N/A',
            fixedCharge = 0,
            energyCharge,
            effectiveRate,
          } = selectedTariff;

          // Parse all numbers safely
          const parsedFixed = !isNaN(parseFloat(fixedCharge)) ? parseFloat(fixedCharge) : 0;
          const parsedEffRate = !isNaN(parseFloat(effectiveRate)) ? parseFloat(effectiveRate) : null;
          const parsedEnergy = !isNaN(parseFloat(energyCharge)) ? parseFloat(energyCharge) : null;

          // Step 3: Calculate final bill based on available rates
          if (parsedEffRate !== null) {
            finalBill = total * parsedEffRate + parsedFixed;
            formula = `TotalUnits (${total}) * EffectiveRate (${parsedEffRate}) + FixedCharge (${parsedFixed})`;
          } else if (parsedEnergy !== null) {
            finalBill = total * parsedEnergy + parsedFixed;
            formula = `TotalUnits (${total}) * EnergyCharge (${parsedEnergy}) + FixedCharge (${parsedFixed})`;
          } else {
            setError("Tariff found, but missing both effectiveRate and energyCharge.");
            return;
          }

          if (finalBill !== null && !isNaN(finalBill)) {
            setBill(finalBill.toFixed(2));
            setDetails({
              totalUnits: total,
              rateUsed: parsedEffRate ?? parsedEnergy,
              fixedCharge: parsedFixed,
              formula,
              subCategory,
              type,
            });
          } else {
            setError("Calculation failed. Invalid final bill.");
            setBill(null);
          }
        }
      } catch (err) {
        console.error("❌ Error calculating bill:", err);
        setBill(null);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, token, monthIndex]);

  return (
    <div className="p-4 w-1/3 rounded-xl bg-white shadow-md text-gray-800">
      <h2 className="text-2xl font-bold mb-2">
        📅 {selectedMonth}-{selectedYear}
      </h2>
      <p className="text-lg mb-1">🔌 Total Units: <strong>{totalUnits}</strong></p>

      {bill !== null && !isNaN(Number(bill)) ? (
        <>
          <p className="text-xl text-green-700"> Bill: ₹<strong>{Number(bill).toFixed(2)}</strong></p>
          <p className="text-sm mt-2 text-gray-600 italic">Formula Used: {details?.formula || 'N/A'}</p>
          <p className="text-sm text-gray-600">Subcategory: {details?.subCategory}</p>
          <p className="text-sm text-gray-600">Type: {details?.type}</p>
        </>
      ) : (
        <p className="text-red-600">Bill could not be calculated.</p>
      )}

      {/* ✅ Error message goes here */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}