"use client";

import { useEffect, useState } from "react";
import { ListingDraft, ListingFile } from "@/components/landlord/types";
import ListingCard from "@/components/landlord/ListingCard";

export default function PropertiesPage() {
  const [listings, setListings] = useState<ListingDraft[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("listings");
    if (saved) {
      try {
        setListings(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing listings from localStorage:", error);
      }
    }
  }, []);

  const handleDelete = (index: number) => {
    const updated = listings.filter((_, i) => i !== index);
    setListings(updated);
    localStorage.setItem("listings", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800"> My Properties</h1>
        <p className="text-sm text-gray-500">
          {listings.length} {listings.length === 1 ? "Listing" : "Listings"}
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 bg-white rounded-xl shadow-sm">
          <img
            src="/empty-property.svg"
            alt="No listings"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <p className="text-lg font-medium">No properties yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Once you upload a listing, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
            <ListingCard
              key={index}
              title={listing.title || "Untitled Listing"}
              description={
                typeof listing.type === "string"
                  ? listing.type
                  : "No description available"
              }
              price={Number(listing.price) || 0}
              location={String(listing.county ?? "Unknown")}
              media={(listing.media as ListingFile[]) || []}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
