"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/currency";
import { getPayments, getTransactions } from "@/lib/storage";

type Payment = {
  id: string;
  listingTitle: string;
  date: string;
  amount: number | string;
  method: string;
};

type Transaction = {
  id: string;
  type: string;
  amount: number | string;
  status: string;
  date: string;
};

type ChartDataPoint = {
  name: string;
  earnings: number;
  withdrawals: number;
};

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0);
  const [pending, setPending] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const payments: Payment[] = getPayments();
    const transactions: Transaction[] = getTransactions();

    const earned = payments.reduce(
      (sum: number, p: Payment) => sum + Number(p.amount || 0),
      0
    );
    const withdrawnSum = transactions
      .filter((t: Transaction) => t.type === "withdraw")
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount || 0), 0);
    const pendingCount = transactions.filter(
      (t: Transaction) => t.status === "pending"
    ).length;

    setEarnings(earned);
    setWithdrawn(withdrawnSum);
    setPending(pendingCount);
    setBalance(earned - withdrawnSum);

    // Build simple monthly chart (last 6 months)
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthEarnings = payments
        .filter((p: Payment) => p.date.startsWith(key))
        .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);
      const monthWithdrawals = transactions
        .filter(
          (t: Transaction) => t.date.startsWith(key) && t.type === "withdraw"
        )
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
      return {
        name: d.toLocaleString(undefined, { month: "short" }),
        earnings: monthEarnings,
        withdrawals: monthWithdrawals,
      };
    });
    setChartData(months);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Wallet</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#58181C] to-[#C81E1E] text-white p-4 rounded-2xl shadow">
          <div className="text-sm">Balance</div>
          <div className="text-2xl font-bold mt-2">
            {formatCurrency(balance)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-xl font-semibold mt-2">
            {formatCurrency(earnings)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Withdrawn</div>
          <div className="text-xl font-semibold mt-2">
            {formatCurrency(withdrawn)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">Pending Withdrawals</div>
          <div className="text-xl font-semibold mt-2">{pending}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/landlord/wallet/withdraw"
          className="flex-1 bg-[#C81E1E] text-white py-3 rounded-xl text-center font-semibold hover:bg-[#58181C] transition"
        >
          Withdraw
        </Link>
        <Link
          href="/landlord/wallet/transactions"
          className="flex-1 bg-[#F4C542] text-black py-3 rounded-xl text-center font-semibold hover:opacity-95 transition"
        >
          Transaction History
        </Link>
        <Link
          href="/landlord/wallet/payments"
          className="flex-1 bg-[#58181C] text-white py-3 rounded-xl text-center font-semibold hover:bg-[#C81E1E] transition"
        >
          View Payments
        </Link>
      </div>

      {/* Charts and Recent Activity */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="font-semibold mb-3 text-gray-800">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart */}
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Monthly Overview</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#58181C"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#C81E1E"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Payments */}
          <div>
            <h3 className="text-sm text-gray-600 mb-2">Latest Payments</h3>
            <div className="space-y-2">
              {getPayments()
                .slice(-5)
                .reverse()
                .map((p: Payment) => (
                  <div
                    key={p.id}
                    className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div>
                      <div className="font-medium">{p.listingTitle}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(p.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(Number(p.amount))}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {p.method}
                      </div>
                    </div>
                  </div>
                ))}
              {getPayments().length === 0 && (
                <div className="text-gray-500">No payments yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
