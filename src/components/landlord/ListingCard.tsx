"use client";

import { Listing } from "@/lib/mockData";

interface ListingCardProps {
  listing: Listing;
  onView?: () => void;
  onAnalytics?: () => void;
  onDelete?: () => void;
}

export default function ListingCard({ listing, onView, onAnalytics, onDelete }: ListingCardProps) {
  const { title, price, location, images } = listing;

  return (
    <div className="col-span-1 border rounded-lg shadow-sm p-3 bg-white transition hover:shadow-md">
      {/* Media Preview */}
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
        {images?.length ? (
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No media</span>
        )}
      </div>

      {/* Info */}
      <div className="font-semibold text-black">{title}</div>
      <div className="text-sm text-gray-500">Ksh {price.toLocaleString()}</div>
      <div className="text-sm text-gray-600">{location}</div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onView}
          className="text-black px-3 py-1 border rounded hover:bg-red-100"
        >
          View
        </button>
        <button
          onClick={onAnalytics}
          className="text-black px-3 py-1 border rounded hover:bg-red-100"
        >
          Analytics
        </button>
        <button
          onClick={onDelete}
          className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
