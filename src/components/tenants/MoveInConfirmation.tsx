// src/components/tenants/MoveInConfirmation.tsx
"use client";

import { useRouter } from "next/navigation";

type MoveInConfirmationProps = {
  date: string;
  time: string;
  listingName: string;
};

export default function MoveInConfirmation({ date, time, listingName }: MoveInConfirmationProps) {
  const router = useRouter();

  const handleConfirmMoveIn = () => {
    router.push("/tenant/lease-finalization/BKG12345");
  };

  return (
    <div className="text-center p-8 bg-green-50 rounded-xl shadow-inner space-y-6">
      <svg
        className="w-16 h-16 text-green-600 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>

      <h3 className="text-3xl font-bold text-green-800">Booking Confirmed!</h3>

      <p className="text-gray-800 text-lg">
        You’ve successfully reserved a viewing for <strong>{listingName}</strong> on <strong>{date}</strong> at <strong>{time}</strong>.
      </p>

      <p className="text-gray-700 bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
        <strong>Note:</strong> Your deposit is held securely in escrow and will only be released to the landlord once you confirm the move-in.
      </p>

      <button
        onClick={handleConfirmMoveIn}
        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
      >
        Confirm Move-in
      </button>
    </div>
  );
}
