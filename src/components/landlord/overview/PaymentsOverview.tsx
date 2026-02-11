"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight, RefreshCw } from "lucide-react";
import { apiFetch } from "@/services/api";

interface Payment {
  tenant: string;
  amount: number;
  date: string;
  property?: string;
}

export default function PaymentsOverview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Payment[] }>("/api/payments");
      if (res.success) {
        setPayments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => router.push("/landlord/wallet/payments")}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
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
            {loading && payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">Loading payments...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No recent payments found.</td>
              </tr>
            ) : (
              payments.map((p, i) => (
              <tr key={i} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="py-2">{p.tenant}</td>
                <td className="py-2 text-gray-600">{p.property || "—"}</td>
                <td className="py-2 text-green-600 font-semibold">
                  KSh {p.amount.toLocaleString()}
                </td>
                <td className="py-2 text-gray-500">{p.date}</td>
              </tr>
            ))
            )}
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
