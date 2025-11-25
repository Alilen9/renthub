"use client";

import { useState, useEffect } from "react";
import DashboardMain from "@/components/landlord/DashboardMain";
import { ListingDraft } from "@/components/landlord/types";

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [listings, setListings] = useState<ListingDraft[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("listings");
    if (stored) setListings(JSON.parse(stored));
  }, []);

  return (
    <div className="p-6 w-full">
      <DashboardMain
        
        
        listings={listings}
        setListings={setListings}
      />
    </div>
  );
}
