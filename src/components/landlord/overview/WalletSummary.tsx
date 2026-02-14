"use client";

import React from "react";
import { useRouter } from "next/navigation"; // ✅ import router

export default function WalletSummary() {
  const router = useRouter(); // ✅ initialize router

  // TODO: replace with real API values later
  const balance = 45200;
  const withdrawn = 10000;
  const pending = 5800;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800"> Wallet Summary</h2>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Total Balance</span>
          <span className="text-lg font-bold text-green-600">
            Ksh {balance.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Total Withdrawn</span>
          <span className="text-gray-800 font-medium">
            Ksh {withdrawn.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Pending Payouts</span>
          <span className="text-yellow-600 font-medium">
            Ksh {pending.toLocaleString()}
          </span>
        </div>
      </div>

       <div className="mt-6 flex justify-between items-center gap-3">
        <button
          onClick={() => router.push("/landlord/wallet")}
          className="px-5 py-2.5 rounded-xl bg-[#C81E1E] text-white hover:bg-[#58181C] font-medium shadow-sm transition-all"
        >
          Withdraw
        </button>

        <button
          onClick={() => router.push("/landlord/wallet/transactions")}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition-all"
        >
          Transaction History
        </button>
      </div>
    </div>
  );
}
