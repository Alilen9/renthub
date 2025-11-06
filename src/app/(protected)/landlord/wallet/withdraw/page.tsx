"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addTransaction } from "@/lib/storage";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"mpesa"|"bank">("mpesa");
  const [account, setAccount] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (!account) return toast.error("Enter recipient details");

    // Create pending transaction and save
    addTransaction({
      id: uuid(),
      type: "withdraw",
      status: "pending",
      method,
      amount: amt,
      date: new Date().toISOString()
    });

    toast.success("Withdrawal request submitted. Processing within 24 hours.");
    setAmount("");
    setAccount("");
    router.push("/landlord/wallet");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Withdraw Funds</h1>

      <label className="block mb-2 text-gray-700">Amount (Ksh)</label>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full p-3 rounded-xl border mb-4"
        placeholder="0"
      />

      <label className="block mb-2 text-gray-700">Method</label>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMethod("mpesa")} className={`flex-1 p-3 rounded-xl border ${method === "mpesa" ? "bg-green-50 border-green-500" : "border-gray-200"}`}>M-Pesa</button>
        <button onClick={() => setMethod("bank")} className={`flex-1 p-3 rounded-xl border ${method === "bank" ? "bg-blue-50 border-blue-500" : "border-gray-200"}`}>Bank</button>
      </div>

      <label className="block mb-2 text-gray-700">{method === "mpesa" ? "M-Pesa Number" : "Bank Account Number"}</label>
      <input value={account} onChange={e => setAccount(e.target.value)} className="w-full p-3 rounded-xl border mb-6" placeholder={method === "mpesa" ? "07xx xxx xxx" : "Account No"} />

      <div className="flex gap-3">
        <button onClick={handleSubmit} className="flex-1 bg-[#C81E1E] text-white p-3 rounded-xl font-semibold">Submit Withdrawal</button>
        <button onClick={() => router.back()} className="flex-1 border p-3 rounded-xl">Cancel</button>
      </div>
    </div>
  );
}
