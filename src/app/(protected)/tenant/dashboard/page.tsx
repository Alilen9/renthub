// src/app/tenant/TenantDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listings } from "@/lib/mockData";
import ListingCard from "@/components/landlord/ListingCard";
import SearchFilters, { Filters } from "@/components/tenants/SearchFilters";
import PropertyMap from "@/components/tenants/PropertyMap";
import { useAuth } from "@/context/AuthContext";
import { fetchApartments } from "@/services/houseService";
import { Apartment } from "@/utils";
import { Search } from "lucide-react";

export default function TenantDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    location: "",
    budget: "",
    type: "",
    verifiedOnly: false,
  });

  const router = useRouter();

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      async function loadApartments() {
          setLoading(true);
          // Fetch the first 3 apartments for the "featured" section
          const data = await fetchApartments(3);
          setApartments(data);
          setLoading(false);
      }
      loadApartments();
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    const maxBudget = Number(filters.budget);
    if (maxBudget > 0 && listing.price > maxBudget) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.verifiedOnly && !listing.verified) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm relative ">
          
            <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or area"
                    // value={searchTerm}
                    // onChange={(e) => {
                    //     setSearchTerm(e.target.value);
                    //     setCurrentPage(1); // Reset page on search
                    // }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
         
          <div className="flex items-center space-x-3">
            
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    showFilterDropdown
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-expanded={showFilterDropdown}
                >
                  <span>Filters</span>
                </button>

                {showFilterDropdown && (
                  <div className="right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
                    <div className="mb-4">
                      <SearchFilters onChange={setFilters} />
                    </div>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`flex items-center w-full justify-center px-4 py-2 rounded transition-colors ${
                        showMap
                          ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {showMap ? "Hide Map View" : "Show Map View"}
                    </button>
                  </div>
                )}
              </div>
            
            
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Saved Properties</h3>
                  <p className="text-2xl font-bold text-red-700">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Applications</h3>
                  <p className="text-2xl font-bold text-red-700">5</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Messages</h3>
                  <p className="text-2xl font-bold text-red-700">8</p>
                </div>
              </div>

              {showMap && (
                <div className="mt-6 mb-8">
                  <PropertyMap listings={filteredListings} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {loading ? (
                    <p className="text-center text-gray-600">Loading apartments...</p>
                ) : apartments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <h3 className="text-lg font-semibold mt-6 mb-4">Available Properties</h3>
              
                        {apartments.map((apartment) => (
                            <ListingCard
                             key={apartment.id}
                              apartment={apartment} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No featured apartments available at the moment.</p>
                )}
              </div>
            </>
          

          
            <div className="bg-white p-6 rounded-lg shadow text-gray-600">
              ⚙️ Settings will be added soon...
            </div>
          
        </main>
      </div>

      {/* View Modal */}
      {showViewModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">{selectedListing.title}</h2>
            <img
              src={selectedListing.images[0]}
              alt={selectedListing.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-600">{selectedListing.description}</p>
            <p className="mt-2 text-red-700 font-semibold">
              Ksh {selectedListing.price.toLocaleString()}
            </p>
            <button
              onClick={() => router.push(`/tenant/listing/${selectedListing.id}`)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Explore
            </button>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-700"
              onClick={() => setShowViewModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Analytics: {selectedListing.title}</h2>
            <p className="text-gray-600">📊 Views: 120</p>
            <p className="text-gray-600">⭐ Interested: 45</p>
            <p className="text-gray-600">✅ Applications: 10</p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-700"
              onClick={() => setShowAnalyticsModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
