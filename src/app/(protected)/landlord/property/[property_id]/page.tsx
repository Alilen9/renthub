"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchListingById } from "@/services/houseService";
import { Apartment } from "@/utils";
import Image from "next/image";
import { Loader2, MapPin, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // The folder name is [property_id], so the param key is property_id
  const id = params?.property_id as string;
  
  const [listing, setListing] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadListing = async () => {
      try {
        const data = await fetchListingById(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.back()}
          className="text-rose-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <ArrowLeft size={20} /> Back to Properties
          </button>
          
          <Link
            href={`/landlord/property/${id}/edit`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Edit size={16} /> Edit Listing
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          {/* Image Hero */}
          <div className="relative h-64 md:h-96 w-full bg-gray-200">
            {listing.image_urls && listing.image_urls.length > 0 ? (
              <Image
                src={listing.image_urls[0]}
                alt={listing.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image Available
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
               <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                  listing.is_active 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-gray-100 text-gray-800 border border-gray-200"
               }`}>
                  {listing.is_active ? "Active" : "Inactive"}
               </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
                <div className="flex items-center text-gray-500">
                  <MapPin size={18} className="mr-1 text-rose-600" />
                  {listing.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-rose-600">
                  Ksh {Number(listing.price).toLocaleString()}
                </div>
                <span className="text-sm text-gray-500">per month</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Details Column */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description || "No description provided."}
                  </p>
                </div>

                {listing.image_urls && listing.image_urls.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {listing.image_urls.slice(1).map((url, idx) => (
                        <div key={idx} className="relative h-32 rounded-lg overflow-hidden border border-gray-100">
                          <Image
                            src={url}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition duration-300"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium text-gray-900 capitalize">{listing.category || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}