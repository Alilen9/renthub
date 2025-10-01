// src/components/map/LocationPicker.tsx
"use client";

type Props = {
  onSelect: (loc: { lat: number; lng: number }) => void;
};

export default function LocationPicker({ onSelect }: Props) {
  const handleClick = () => {
    // dummy coords for now
    const loc = { lat: -1.2921, lng: 36.8219 }; // Nairobi default
    onSelect(loc);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg cursor-pointer text-gray-500 bg-gray-50 hover:bg-gray-100"
    >
      🗺️ Map Placeholder (Click to drop pin)
    </div>
  );
}
