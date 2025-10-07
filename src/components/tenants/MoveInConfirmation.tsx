// src/components/MoveInConfirmation.tsx
"use client";

import { useState } from "react";

export default function MoveInConfirmation({ listingId }: { listingId: string }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    alert("Funds released to landlord. Welcome to your new home! 🎉");
  };

  return (
    <div className="p-4 border rounded-xl bg-green-50 space-y-4">
      {!confirmed ? (
        <>
          <p className="text-gray-700">
            Please confirm that you’ve moved into the property and everything
            matches your agreement. Once confirmed, funds in escrow will be
            released to the landlord.
          </p>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Confirm Move-in
          </button>
        </>
      ) : (
        <p className="text-green-700 font-semibold">
          🎉 Move-in confirmed. Escrow released to landlord.
        </p>
      )}
    </div>
  );
}
