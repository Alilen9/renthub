// src/components/tenants/BookingReview.tsx
"use client";

import { useState } from "react";

type BookingReviewProps = {
  date: string;
  time: string;
  listingName: string;
  onBack: () => void;
  onFinalConfirm: (details: { name: string; email: string }) => void;
};

export default function BookingReview({ date, time, listingName, onBack, onFinalConfirm }: BookingReviewProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const isValid = name.trim() !== "" && email.includes("@");

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onFinalConfirm({ name, email });
      }}
    >
      <h3 className="text-2xl font-bold text-black border-b pb-3">
        2. Review & Contact Details
      </h3>

      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm text-black">
        <p className="font-semibold">Viewing for {listingName}</p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
      </div>

      <div className="space-y-3">
        <label className="block font-medium text-black">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Full Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-green-500 focus:border-green-500"
        />

        <label className="block font-medium text-black">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-xs text-gray-500">A calendar invite will be sent here.</p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border rounded-lg font-bold text-black hover:bg-gray-100"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`flex-1 py-3 rounded-lg font-bold text-white ml-3 ${
            isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Confirm & Continue
        </button>
      </div>
    </form>
  );
}
