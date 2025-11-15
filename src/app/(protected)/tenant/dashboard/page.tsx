"use client";

import { useState, useEffect, useMemo } from "react";
import { listings } from "@/lib/mockData";
import { useRouter } from "next/navigation";

import SearchFilters, { Filters } from "@/components/tenants/SearchFilters";
import PropertyMap from "@/components/tenants/PropertyMap";
import TenantSidebar from "@/components/tenants/TenantSidebar";
import ListingCard from "@/components/tenants/ListingCard";

/* ---------- Types ---------- */
type NoticeFile = { name: string; type: string; size: number; dataUrl?: string; };
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

/* ---------- Page ---------- */
export default function TenantDashboard() {
  const router = useRouter();

  // UI + sidebar
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // filters / listings
  const [showMap, setShowMap] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({ location: "", budget: "", type: "", verifiedOnly: false });

  // notices
  const [notices, setNotices] = useState<Notice[]>([]);
  const tenantId = "tenant_1"; // replace with actual auth id

  useEffect(() => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored.reverse());
  }, []);

  // --- isResident: controls the dashboard mode (searching vs resident) ---
  const [isResident, setIsResident] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isResident") === "true";
    } catch {
      return false;
    }
  });

  // watch localStorage changes (e.g., confirm move-in on another page)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "isResident") {
        setIsResident(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // helper to set resident (useful if you want to toggle from dashboard - demo only)
  const markResident = () => {
    localStorage.setItem("isResident", "true");
    setIsResident(true);
  };

  // unread notices
  const unreadNotices = useMemo(() => notices.filter(n => !n.readBy.includes(tenantId)), [notices, tenantId]);

  const toggleReadNotice = (id: string) => {
    const updated = notices.map((n) => {
      if (n.id === id) {
        const isRead = n.readBy.includes(tenantId);
        const updatedReadBy = isRead ? n.readBy.filter(tid => tid !== tenantId) : [...n.readBy, tenantId];
        return { ...n, readBy: updatedReadBy };
      }
      return n;
    });
    setNotices(updated);
    localStorage.setItem("notices", JSON.stringify(updated.reverse()));
  };

  // dashboard data (mocked — replace with API calls)
  const [savedProperties, setSavedProperties] = useState(() => listings.filter((l) => (l as any).saved));
  const [applications, setApplications] = useState(() => [
    { id: "app1", property: "Riverwalk Lofts", status: "Pending" },
    { id: "app2", property: "Sunset Apartments", status: "Approved" },
  ]);
  const [messages, setMessages] = useState(() => [
    { id: 1, from: "Landlord", content: "Welcome!", read: false },
    { id: 2, from: "Landlord", content: "Please submit your docs.", read: true },
  ]);
  const unreadMessages = messages.filter(m => !m.read);

  // filtered listings (for searching mode)
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm relative z-10">
          <h2 className="text-xl font-semibold">{activeMenu}</h2>
          <div className="flex items-center space-x-3">
            {!isResident && (
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${showFilterDropdown ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                      className={`flex items-center w-full justify-center px-4 py-2 rounded transition-colors ${showMap ? "bg-gray-300 text-gray-800 hover:bg-gray-400" : "bg-red-600 text-white hover:bg-red-700"}`}
                    >
                      {showMap ? "Hide Map View" : "Show Map View"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="avatar" className="w-10 h-10 rounded-full" />
            <span className="font-medium">Alice Tenant</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Notices banner (both modes) */}
          {unreadNotices.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded shadow flex justify-between items-center">
              <p className="text-yellow-800 font-medium">You have {unreadNotices.length} unread notice{unreadNotices.length > 1 ? "s" : ""}!</p>
              <div className="flex gap-2">
                <a href="/tenant/notices" className="underline text-yellow-900 hover:text-yellow-700">View Notices</a>
                <button onClick={() => unreadNotices.forEach(n => toggleReadNotice(n.id))} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Mark all read</button>
              </div>
            </div>
          )}

          {/* MODE: Searching (not resident) */}
          {!isResident && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/saved-properties")}>
                  <h3 className="text-gray-500">Saved Properties</h3>
                  <p className="text-2xl font-bold text-red-700">{savedProperties.length}</p>
                  {savedProperties.length === 0 && <p className="text-sm text-gray-400 mt-1">No saved properties yet</p>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/applications")}>
                  <h3 className="text-gray-500">Applications</h3>
                  <p className="text-2xl font-bold text-red-700">{applications.length}</p>
                  {applications.length === 0 && <p className="text-sm text-gray-400 mt-1">No applications submitted</p>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/chat")}>
                  <h3 className="text-gray-500">Messages</h3>
                  <p className="text-2xl font-bold text-red-700">{unreadMessages.length}</p>
                  {unreadMessages.length === 0 && <p className="text-sm text-gray-400 mt-1">All messages read</p>}
                </div>
              </div>

              {/* Map */}
              {showMap && <div className="mt-6 mb-8"><PropertyMap listings={filteredListings} /></div>}

              {/* Listings */}
              <h3 className="text-lg font-semibold mt-6 mb-4">Available Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
                {filteredListings.length === 0 && <p className="text-gray-600">No listings match your filters.</p>}
              </div>
            </>
          )}

          {/* MODE: Resident (after Confirm Move-in) */}
          {isResident && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Lease</h3>
                  <p className="text-2xl font-bold text-green-700">Active</p>
                  <p className="text-sm text-gray-500 mt-2">Ends: 2026-01-31</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Upcoming Inspection</h3>
                  <p className="text-2xl font-bold text-red-700">1</p>
                  <p className="text-sm text-gray-500 mt-2">Next: 2025-12-05</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500">Messages</h3>
                  <p className="text-2xl font-bold text-red-700">{unreadMessages.length}</p>
                  <p className="text-sm text-gray-500 mt-2">Open chat for maintenance or landlord messages</p>
                </div>
              </div>

              {/* Resident specific actions */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Report a Fault</h4>
                    <p className="text-sm text-gray-500">Report a maintenance issue to your landlord.</p>
                  </div>
                  <button className="px-4 py-2 bg-[#C81E1E] text-white rounded-lg" onClick={() => router.push("/tenant/maintainance")}>Report Fault</button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-semibold">Rent & Payments</h4>
                  <p className="text-sm text-gray-500">View rent history, upcoming due dates, and pay online (when enabled).</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Lease Details</h4>
                    <p className="text-sm text-gray-500">Unit 4B - Riverwalk Lofts • Lease: 2025-01-01 → 2026-01-31</p>
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800" onClick={() => { localStorage.removeItem("isResident"); setIsResident(false); }}>Switch to Search Mode</button>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
