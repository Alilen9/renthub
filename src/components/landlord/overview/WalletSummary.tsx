"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";
import { RefreshCw } from "lucide-react";

interface WalletStats {
  balance: number;
  withdrawn: number;
  pending: number;
}

export default function WalletSummary() {
  const router = useRouter();
  const [stats, setStats] = useState<WalletStats>({
    balance: 0,
    withdrawn: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: WalletStats }>("/api/wallet/summary");
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch wallet stats", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800"> Wallet Summary</h2>
        <button onClick={loadStats} disabled={loading} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Refresh">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Total Balance</span>
          <span className="text-lg font-bold text-green-600">
            {loading ? "..." : `Ksh ${stats.balance.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Total Withdrawn</span>
          <span className="text-gray-800 font-medium">
            {loading ? "..." : `Ksh ${stats.withdrawn.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Pending Payouts</span>
          <span className="text-yellow-600 font-medium">
            {loading ? "..." : `Ksh ${stats.pending.toLocaleString()}`}
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
