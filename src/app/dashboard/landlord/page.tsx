"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/landlord/DashboardSidebar";
import DashboardMain from "@/components/landlord/DashboardMain";
import CreateListingModal from "@/components/landlord/CreateListingModal";
import { ListingDraft, ListingFile } from "@/components/landlord/types";


export default function LandlordDashboardPage() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [listings, setListings] = useState<ListingDraft[]>([]);

  // Load listings from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem("listings");
    if (stored) {
      setListings(JSON.parse(stored));
    }
  }, []);

  const handlePublish = async (listing: ListingDraft) => {
    // Convert File objects to ListingFile objects with a base64 preview URL
    const filesWithPreviews: ListingFile[] = await Promise.all(
      listing.files.map((file) => {
        return new Promise<ListingFile>((resolve, reject) => {
          if (file instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                type: file.type,
                previewUrl: reader.result as string,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          } else {
            // If it's already a ListingFile object, resolve directly
            resolve(file);
          }
        });
      })
    );

    const newListing = { ...listing, files: filesWithPreviews };

    // Update the state and localStorage with the new listing
    setListings((prevListings) => {
      const updatedListings = [...prevListings, newListing];
      localStorage.setItem("listings", JSON.stringify(updatedListings));
      return updatedListings;
    });

    // Close the modal
    setCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <DashboardSidebar setCreateOpen={setCreateOpen} />
        <DashboardMain
          setCreateOpen={setCreateOpen}
          listings={listings} // Pass listings state down
           setListings={setListings} 
        />
      </div>

      <CreateListingModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}