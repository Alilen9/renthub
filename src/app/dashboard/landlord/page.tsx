"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/landlord/DashboardSidebar";
import DashboardMain from "@/components/landlord/DashboardMain";
import CreateListingModal from "@/components/landlord/CreateListingModal";
import { ListingDraft } from "@/components/landlord/types";

export default function LandlordDashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [listings, setListings] = useState<ListingDraft[]>([]);

  // ✅ Load listings from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem("listings");
    if (saved) {
      setListings(JSON.parse(saved));
    }
  }, []);

  // ✅ Handle publishing new listings
  const handlePublish = (newListing: ListingDraft) => {
    const updated = [...listings, newListing];
    setListings(updated);
    localStorage.setItem("listings", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 grid grid-cols-12 gap-6">
      {/* Sidebar (3 columns) */}
      <DashboardSidebar setCreateOpen={setCreateOpen} />

      {/* Main Content (9 columns) */}
      <DashboardMain
        setCreateOpen={setCreateOpen}
        listings={listings}
        setListings={setListings}
      />

      {/* ✅ Create Listing Modal */}
      <CreateListingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
