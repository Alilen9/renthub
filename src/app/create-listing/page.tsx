"use client";

import React, { useState } from "react";
import CreateListingModal from "@/components/landlord/CreateListingModal";
import { ListingDraft } from "@/components/landlord/types";

export default function CreateListingPage() {
  const [open, setOpen] = useState(true);

  const handlePublish = (listing: ListingDraft) => {
    console.log("✅ Final listing to publish:", listing);
    alert("Listing published successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <CreateListingModal
        open={open}
        onClose={() => setOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
