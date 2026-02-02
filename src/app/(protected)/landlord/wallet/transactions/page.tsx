"use client";

import { getTransactions } from "@/lib/storage";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: string;
  amount: number | string;
  status: string;
  date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => setTransactions(getTransactions() as Transaction[]), []);

  const filtered = transactions.filter(t => filter === "all" ? true : t.type === filter);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      <div className="flex items-center gap-3 mb-4">
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="p-2 border rounded-xl">
          <option value="all">All</option>
          <option value="withdraw">Withdrawals</option>
          <option value="payment">Payments</option>
          <option value="deposit">Deposits</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-semibold">{tx.type.toUpperCase()}</div>
                <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">Ksh {Number(tx.amount).toLocaleString()}</div>
                <div className="text-sm">{tx.status === "pending" ? <span className="text-orange-500">Pending</span> : <span className="text-green-600">Success</span>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
