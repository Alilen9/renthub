"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight } from "lucide-react";

interface Payment {
  tenant: string;
  amount: number;
  date: string;
  property?: string;
}

export default function PaymentsOverview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("payments_overview");
    if (saved) {
      setPayments(JSON.parse(saved));
    } else {
      const defaults: Payment[] = [
        { tenant: "John Doe", amount: 12000, date: "2025-11-01", property: "2BR Apartment" },
        { tenant: "Jane Smith", amount: 10500, date: "2025-10-25", property: "Studio Ruiru" },
      ];
      setPayments(defaults);
      localStorage.setItem("payments_overview", JSON.stringify(defaults));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
        </div>
        <button
          onClick={() => router.push("/landlord/wallet/payments")}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Payments Table */}
      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <table className="w-full text-sm">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="text-left py-2">Tenant</th>
              <th className="text-left py-2">Property</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="py-2">{p.tenant}</td>
                <td className="py-2 text-gray-600">{p.property || "—"}</td>
                <td className="py-2 text-green-600 font-semibold">
                  KSh {p.amount.toLocaleString()}
                </td>
                <td className="py-2 text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Button */}
      <div className="mt-5">
        <button
          onClick={() => router.push("/landlord/wallet/payments")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
        >
          View All Payments
        </button>
      </div>
    </div>
  );
}
