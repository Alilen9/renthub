// src/app/tenant/TenantDashboard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { listings } from "@/lib/mockData";
import ListingCard from "@/components/landlord/ListingCard";
import SearchFilters, { Filters } from "@/components/tenants/SearchFilters";
import PropertyMap from "@/components/tenants/PropertyMap";
import TenantSidebar from "@/components/tenants/TenantSidebar";

export default function TenantDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
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

  const filteredListings = listings.filter((listing) => {
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    const maxBudget = Number(filters.budget);
    if (maxBudget > 0 && listing.price > maxBudget) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.verifiedOnly && !listing.verified) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm relative z-10">
          <h2 className="text-xl font-semibold">{activeMenu}</h2>
          <div className="flex items-center space-x-3">
            {activeMenu === "Dashboard" && (
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
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
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
            )}
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">Alice Tenant</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {activeMenu === "Dashboard" && (
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

              <h3 className="text-lg font-semibold mt-6 mb-4">Available Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onView={() => {
                      setSelectedListing(listing);
                      setShowViewModal(true);
                    }}
                    onAnalytics={() => {
                      setSelectedListing(listing);
                      setShowAnalyticsModal(true);
                    }}
                    onDelete={() => alert("Delete disabled for tenants")}
                  />
                ))}
                {filteredListings.length === 0 && (
                  <p className="text-gray-600">No listings match your filters.</p>
                )}
              </div>
            </>
          )}

          {activeMenu === "Settings" && (
            <div className="bg-white p-6 rounded-lg shadow text-gray-600">
              ⚙️ Settings will be added soon...
            </div>
          )}
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
