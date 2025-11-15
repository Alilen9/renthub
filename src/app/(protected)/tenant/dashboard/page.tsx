// src/app/tenant/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { listings } from "@/lib/mockData";

import SearchFilters, { Filters } from "@/components/tenants/SearchFilters";
import PropertyMap from "@/components/tenants/PropertyMap";
import TenantSidebar from "@/components/tenants/TenantSidebar";
import ListingCard from "@/components/tenants/ListingCard";

type NoticeFile = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type Notice = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  assignedStaff: string[];
  files?: NoticeFile[];
  createdAt: string;
  readBy: string[]; // tenant IDs who read this notice
};

export default function TenantDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showMap, setShowMap] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    location: "",
    budget: "",
    type: "",
    verifiedOnly: false,
  });

  // --- Notices ---
  const [notices, setNotices] = useState<Notice[]>([]);
  const tenantId = "tenant_1"; // could be dynamic from auth/session

  useEffect(() => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored.reverse());
  }, []);

  const unreadNotices = notices.filter(n => !n.readBy.includes(tenantId));

  const toggleReadNotice = (id: string) => {
    const updated = notices.map((n) => {
      if (n.id === id) {
        const isRead = n.readBy.includes(tenantId);
        const updatedReadBy = isRead
          ? n.readBy.filter(tid => tid !== tenantId)
          : [...n.readBy, tenantId];
        return { ...n, readBy: updatedReadBy };
      }
      return n;
    });
    setNotices(updated);
    localStorage.setItem("notices", JSON.stringify(updated.reverse()));
  };

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
          {/* --- Notification Banner --- */}
          {unreadNotices.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded shadow flex justify-between items-center">
              <p className="text-yellow-800 font-medium">
                You have {unreadNotices.length} unread notice
                {unreadNotices.length > 1 ? "s" : ""}!
              </p>
              <div className="flex gap-2">
                <a
                  href="/tenant/notices"
                  className="underline text-yellow-900 hover:text-yellow-700"
                >
                  View Notices
                </a>
                <button
                  onClick={() => unreadNotices.forEach(n => toggleReadNotice(n.id))}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Mark all read
                </button>
              </div>
            </div>
          )}

          {activeMenu === "Dashboard" && (
            <>
              {/* Stats */}
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

              {/* Map View */}
              {showMap && (
                <div className="mt-6 mb-8">
                  <PropertyMap listings={filteredListings} />
                </div>
              )}

              {/* Listings */}
              <h3 className="text-lg font-semibold mt-6 mb-4">Available Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
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
    </div>
  );
}
