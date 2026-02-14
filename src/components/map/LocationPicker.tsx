// src/components/map/LocationPicker.tsx
"use client";

import { useState } from "react";

type Props = {
  onSelect: (loc: { lat: number; lng: number; address: string }) => void;
};

export default function LocationPicker({ onSelect }: Props) {
  const [address, setAddress] = useState("");

  const handleSelect = () => {
    if (!address.trim()) return;

    // You can later add real geocoding here
    const dummyCoords = { lat: -1.2921, lng: 36.8219 };

    onSelect({ ...dummyCoords, address });
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        Enter Location (Estate / Street / Building)
      </label>

      <input
        type="text"
        placeholder="Eg: Ruiru, Kahawa Sukari, Kasarani, Pipeline..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50"
      />

      <button
        onClick={handleSelect}
        className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Save Location
      </button>
    </div>
  );
}
