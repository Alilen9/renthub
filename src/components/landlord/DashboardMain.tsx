// src/components/landlord/DashboardMain.tsx
"use client";

import React from "react";
import ListingCard from "./ListingCard";
import { ListingDraft, ListingFile } from "./types";

interface DashboardMainProps {
  setCreateOpen: (v: boolean) => void;
  listings: ListingDraft[];
  setListings: React.Dispatch<React.SetStateAction<ListingDraft[]>>; // ✅ new prop to update listings
}

export default function DashboardMain({
  setCreateOpen,
  listings,
  setListings,
}: DashboardMainProps) {
  const handleDelete = (idx: number) => {
    const updated = listings.filter((_, i) => i !== idx);
    setListings(updated);
    localStorage.setItem("listings", JSON.stringify(updated)); // ✅ persist change
  };

  return (
    <main className="col-span-9">
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <header className="flex items-center justify-between">
          <h1 className="text-black font-semibold">My Listings</h1>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            + Add Listing
          </button>
        </header>

        {/* Listings Grid */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-black">
          {listings.length > 0 ? (
            listings.map((listing, idx) => (
              <ListingCard
                key={idx}
                title={listing.title}
                price={Number(listing.price)}
                location={listing.county as string}
                files={listing.files as ListingFile[]}
                onDelete={() => handleDelete(idx)} // ✅ pass delete handler
              />
            ))
          ) : (
            <div className="col-span-3 border rounded p-6 text-center text-gray-500">
              No listings yet. Click{" "}
              <span className="font-semibold">+ Add Listing</span> to create one.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
