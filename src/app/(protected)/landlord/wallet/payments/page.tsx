"use client";

import { useEffect, useState } from "react";
import { getPayments } from "@/lib/storage";

type Payment = {
  id: string;
  listingTitle: string;
  date: string;
  amount: number | string;
  method: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => setPayments(getPayments()), []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-black">Payment History</h1>

      {payments.length === 0 ? (
        <p className="text-black">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-black">Transaction ID</th>
                <th className="p-3 text-left text-black">Listing</th>
                <th className="p-3 text-left text-black">Method</th>
                <th className="p-3 text-right text-black">Amount</th>
                <th className="p-3 text-left text-black">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3 text-sm text-black">{p.id}</td>
                  <td className="p-3 text-black">{p.listingTitle}</td>
                  <td className="p-3 capitalize text-black">{p.method}</td>
                  <td className="p-3 text-right text-black">
                    Ksh {Number(p.amount).toLocaleString()}
                  </td>
                  <td className="p-3 text-black">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
