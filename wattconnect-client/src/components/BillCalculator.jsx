import { useEffect, useState } from 'react';
import {tariffdata} from '../assets/tariffdata';

export default function BillCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(null);
  const [details, setDetails] = useState(null);

  // ✅ Static user category
  const category = "LT-II Domestic A";

  // ✅ Static daily usage (partial data only for 5 days)
  const dailyUsage = [6]; // total: 20 units

  useEffect(() => {
    // 👉 Pad to full 30 days (missing = 0)
    const fullUsage = Array.from({ length: 30 }, (_, i) => dailyUsage[i] || 0);
    const totalMonthlyUnits = fullUsage.reduce((sum, val) => sum + val, 0);

    // 👉 Find matching tariff slab
    const matchedSlab = tariffdata.find((item) => {
      if (item.category === category) {
        if (item.unitRange) {
          const [min, max] = item.unitRange;
          return totalMonthlyUnits >= min && totalMonthlyUnits <= max;
        }
        return true; // no range = flat rate
      }
      return false;
    });

    if (!matchedSlab) {
      setMonthlyBill("❌ No matching tariff slab found.");
      return;
    }

    const {
      subCategory,
      fixedCharge = 0,
      energyCharge = 0,
      subsidyTargeted = 0,
      subsidyTariff = 0,
    } = matchedSlab;

    const totalSubsidy = subsidyTargeted + subsidyTariff;
    const effectiveRate = energyCharge - totalSubsidy;

    // ✅ Final bill calculation
    const bill = totalMonthlyUnits * effectiveRate + fixedCharge;

    setDetails({
      subCategory: subCategory || "N/A",
      fixedCharge,
      energyCharge,
      subsidyTargeted,
      subsidyTariff,
      totalSubsidy,
      effectiveRate,
      totalMonthlyUnits,
    });

    setMonthlyBill(bill.toFixed(2));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <p><strong>Category:</strong> {category}</p>

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
      ) : (
        <p className="text-red-600 mt-4">{monthlyBill}</p>
      )}
    </div>
  );
}