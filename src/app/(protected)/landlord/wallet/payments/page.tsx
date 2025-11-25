"use client";

import { useEffect, useState } from "react";
import { getPayments } from "@/lib/storage";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => setPayments(getPayments()), []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      {payments.length === 0 ? (
        <p className="text-gray-500">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left">Listing</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="p-3 text-sm">{p.id}</td>
                  <td className="p-3">{p.listingTitle}</td>
                  <td className="p-3 capitalize">{p.method}</td>
                  <td className="p-3 text-right">Ksh {Number(p.amount).toLocaleString()}</td>
                  <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
