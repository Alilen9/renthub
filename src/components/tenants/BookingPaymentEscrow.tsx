// src/components/tenants/BookingPaymentEscrow.tsx
"use client";

import { useState } from "react";

type BookingPaymentEscrowProps = {
  date: string;
  time: string;
  listingName: string;
  depositAmount?: number;
  onBack: () => void;
  onPaymentSuccess: () => void;
};

export default function BookingPaymentEscrow({
  date,
  time,
  listingName,
  depositAmount = 500,
  onBack,
  onPaymentSuccess,
}: BookingPaymentEscrowProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [card, setCard] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const isValid = name && email.includes("@") && card.length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h3 className="text-2xl font-bold text-black border-b pb-3">
        3. Secure Deposit
      </h3>

      <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-lg text-black">
        <p className="font-semibold">Booking for {listingName}</p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p className="mt-2 font-bold">${depositAmount}</p>
      </div>

      <div className="space-y-3">
        <label className="block text-black font-medium">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-green-500 focus:border-green-500"
        />
        <label className="block text-black font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-green-500 focus:border-green-500"
        />
        <label className="block text-black font-medium">Card (Mock)</label>
        <input
          type="text"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-blue-500 focus:border-blue-500"
          placeholder="XXXX XXXX XXXX XXXX"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="flex-1 py-3 border rounded-lg font-bold text-black hover:bg-gray-100"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!isValid || processing}
          className={`flex-1 py-3 ml-3 rounded-lg font-bold text-white flex justify-center items-center ${
            isValid && !processing ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {processing ? "Processing..." : `Pay $${depositAmount}`}
        </button>
      </div>
    </form>
  );
}
