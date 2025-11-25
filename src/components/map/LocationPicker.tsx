// src/components/map/LocationPicker.tsx
"use client";

import { useState, useEffect } from "react";

type Props = {
  onSelect: (loc: { lat: number; lng: number; address: string }) => void;
};

// ---- Choose the mode here ----
// "manual" | "suggestions" | "google"
const MODE: "manual" | "suggestions" | "google" = "suggestions";

export default function LocationPicker({ onSelect }: Props) {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // ---------- OPTION 2: Free Auto-Suggestions (OpenStreetMap) ----------
  useEffect(() => {
    if (MODE !== "suggestions") return;
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await res.json();
      setSuggestions(data);
    }, 300);

    return () => clearTimeout(delay);
  }, [address]);

  const handleManualSelect = () => {
    if (!address.trim()) return;

    onSelect({
      lat: -1.2921,
      lng: 36.8219,
      address,
    });
  };

  return (
    <div className="flex flex-col space-y-3 w-full relative">
      <label className="text-sm font-medium text-gray-700">
        Location
      </label>

      {/* ----------- OPTION 1: Manual Input ----------- */}
      {MODE === "manual" && (
        <>
          <input
            type="text"
            placeholder="Enter location manually..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500"
          />

          <button
            onClick={handleManualSelect}
            className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Save Location
          </button>
        </>
      )}

      {/* ----------- OPTION 2: Auto-suggest (OpenStreetMap) ----------- */}
      {MODE === "suggestions" && (
        <div className="w-full">
          <input
            type="text"
            placeholder="Search location (free autocomplete)..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-yellow-500"
          />

          {suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-white shadow-md rounded-lg max-h-60 overflow-y-auto z-20">
              {suggestions.map((item) => (
                <li
                  key={item.place_id}
                  onClick={() => {
                    setAddress(item.display_name);
                    setSuggestions([]);
                    onSelect({
                      lat: parseFloat(item.lat),
                      lng: parseFloat(item.lon),
                      address: item.display_name,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ----------- OPTION 3: Google Places Autocomplete ----------- */}
      {MODE === "google" && (
        <input
          id="google-autocomplete"
          type="text"
          placeholder="Google Autocomplete (requires API key)"
          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
