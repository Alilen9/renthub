"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useSavedProperties } from "@/hooks/useSavedProperties";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    description?: string;
  };
}

export default function TenantListingCard({ listing }: ListingCardProps) {
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(listing.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(listing.id);
  };

  return (
    <div className="border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden bg-white group">
      {/* Property Image with Save Button */}
      <div className="relative h-48 w-full">
        <Image
          src={listing.images[0] || "/placeholder-property.jpg"}
          alt={listing.title}
          fill
          className="object-cover"
          priority={false}
        />
        {/* Save/Heart Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-transform hover:scale-110"
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              saved ? "fill-red-600 text-red-600" : "text-gray-400 hover:text-red-600"
            }`}
          />
        </button>
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {listing.verified && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              ✔ Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>
        <p className="text-gray-600 text-sm">{listing.location}</p>
        <p className="mt-2 text-red-600 font-bold">
          KES {listing.price.toLocaleString()}
        </p>
        {listing.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{listing.description}</p>
        )}

        {/* View Details */}
        <div className="mt-3">
          <a
            href={`/tenant/listing/${listing.id}`}
            className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}
