"use client";

import { useEffect, useState } from "react";
import { ListingFile } from "@/components/landlord/types";
import ListingCard from "@/components/landlord/ListingCard";
import { Apartment } from "@/utils";
import { deleteHouse, fetchListings } from "@/services/houseService";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [listings, setListings] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
        toast.error("Could not load your properties.");
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const idStr = String(id);
    const originalListings = [...listings];
    setListings(listings.filter((l) => String(l.id) !== idStr));
    const { success, message } = await deleteHouse(idStr);
    if (!success) {
      toast.error(`Failed to delete: ${message}`);
      setListings(originalListings);
    } else {
      toast.success("Listing deleted successfully.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800"> My Properties</h1>
        <p className="text-sm text-gray-500">
          {listings.length} {listings.length === 1 ? "Listing" : "Listings"}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading your properties...</p>
      ) : listings.length === 0 ? (
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
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              title={listing.name || "Untitled Listing"}
              description={listing.description || "No description available"}
              price={Number(listing.price) || 0}
              location={listing.location ?? "Unknown"}
              media={
                (listing.image_urls?.map((url) => ({ url, type: "image" })) as ListingFile[]) || []
              }
              onDelete={() => handleDelete(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
