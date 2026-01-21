"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState } from "react";

type Transaction = { id: number; type: "Credit" | "Debit"; amount: string; date: string };

export default function SPNWalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: "Credit", amount: "KES 1,500", date: "Nov 15, 2025" },
    { id: 2, type: "Debit", amount: "KES 500", date: "Nov 16, 2025" },
    { id: 3, type: "Credit", amount: "KES 2,000", date: "Nov 17, 2025" },
  ]);

  const [totalBalance, setTotalBalance] = useState(5000);
  const [amount, setAmount] = useState("");
  const [isDeposit, setIsDeposit] = useState(true);

  const handleTransaction = () => {
    if (!amount || isNaN(Number(amount))) return alert("Enter a valid amount");

    const amt = Number(amount);

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: isDeposit ? "Credit" : "Debit",
      amount: `KES ${amt}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setTransactions([newTransaction, ...transactions]);
    setTotalBalance(isDeposit ? totalBalance + amt : totalBalance - amt);
    setAmount("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <SPNSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Wallet</h1>

          {/* Total Balance */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-black">Total Balance</h2>
            <p className="text-3xl font-bold text-black">KES {totalBalance}</p>
          </div>

          {/* Deposit / Withdraw Section */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-black">Manage Balance</h2>
            <div className="flex gap-4 flex-wrap items-center">
              <select
                value={isDeposit ? "Deposit" : "Withdraw"}
                onChange={(e) => setIsDeposit(e.target.value === "Deposit")}
                className="p-2 border rounded-lg text-black"
              >
                <option>Deposit</option>
                <option>Withdraw</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="p-2 border rounded-lg text-black"
              />
              <button
                onClick={handleTransaction}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {isDeposit ? "Deposit" : "Withdraw"}
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-black">Recent Transactions</h2>
            <ul className="divide-y divide-gray-200">
              {transactions.map((t) => (
                <li key={t.id} className="flex justify-between py-2">
                  <span className="text-black">{t.type}</span>
                  <span className="text-black">{t.amount}</span>
                  <span className="text-black">{t.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
