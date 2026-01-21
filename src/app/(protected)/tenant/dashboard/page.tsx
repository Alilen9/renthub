"use client";

import { useEffect, useState, useMemo } from "react";
import { listings } from "@/lib/mockData";
import { useRouter } from "next/navigation";

import SearchFilters, { Filters } from "@/components/tenants/SearchFilters";
import PropertyMap from "@/components/tenants/PropertyMap";
import { useAuth } from "@/context/AuthContext";
import { fetchApartments } from "@/services/houseService";
import { Apartment } from "@/utils";
import { Search } from "lucide-react";
import ListingCard from "@/components/landlord/ListingCard";

// Define the types locally or import them
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
  readBy: string[]; 
};

export default function TenantDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // FIX 1: Define tenantId from the auth context
  const tenantId = user?.id || "";

  const [showMap, setShowMap] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    location: "",
    budget: "",
    type: "",
    verifiedOnly: false,
  });

  const [notices, setNotices] = useState<Notice[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [savedProperties] = useState(() => listings.filter((l) => (l as any).saved));
  const [applications] = useState([
    { id: "app1", property: "Riverwalk Lofts", status: "Pending" },
    { id: "app2", property: "Sunset Apartments", status: "Approved" },
  ]);
  const [messages] = useState([
    { id: 1, from: "Landlord", content: "Welcome!", read: false },
    { id: 2, from: "Landlord", content: "Please submit your docs.", read: true },
  ]);

  const unreadMessages = messages.filter(m => !m.read);

  const [isResident, setIsResident] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isResident") === "true";
    }
    return false;
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "isResident") setIsResident(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // FIX 2: Resolved ReferenceError for tenantId
  const unreadNotices = useMemo(() => 
    notices.filter(n => tenantId && !n.readBy.includes(tenantId)), 
  [notices, tenantId]);

  useEffect(() => {
    async function loadApartments() {
      try {
        setLoading(true);
        const data = await fetchApartments(3);
        setApartments(data);
      } catch (err) {
        console.error("Failed to fetch apartments", err);
      } finally {
        setLoading(false);
      }
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

  // FIX 3: Placeholder implementation to avoid crashes
  function toggleReadNotice(id: string): void {
    setNotices(prev => prev.map(n => 
      n.id === id ? { ...n, readBy: [...n.readBy, tenantId] } : n
    ));
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm relative">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or area"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
         
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${showFilterDropdown ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <span>Filters</span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
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
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {unreadNotices.length > 0 && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded shadow flex justify-between items-center">
              <p className="text-yellow-800 font-medium">You have {unreadNotices.length} unread notice{unreadNotices.length > 1 ? "s" : ""}!</p>
              <div className="flex gap-2">
                <button onClick={() => router.push("/tenant/notices")} className="underline text-yellow-900 hover:text-yellow-700">View Notices</button>
                <button onClick={() => unreadNotices.forEach(n => toggleReadNotice(n.id))} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Mark all read</button>
              </div>
            </div>
          )}

          {!isResident ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/saved-properties")}>
                  <h3 className="text-gray-500 font-medium">Saved Properties</h3>
                  <p className="text-2xl font-bold text-red-700">{savedProperties.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/applications")}>
                  <h3 className="text-gray-500 font-medium">Applications</h3>
                  <p className="text-2xl font-bold text-red-700">{applications.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push("/tenant/chat")}>
                  <h3 className="text-gray-500 font-medium">Messages</h3>
                  <p className="text-2xl font-bold text-red-700">{unreadMessages.length}</p>
                </div>
              </div>

              {showMap && (
                <div className="mt-6 mb-8">
                  <PropertyMap listings={filteredListings} />
                </div>
              )}

              <h3 className="text-lg font-semibold mb-4">Available Properties</h3>
              {loading ? (
                <p className="text-center text-gray-600">Loading apartments...</p>
              ) : apartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {apartments.map((apartment) => (
                    <ListingCard
                      key={apartment.id}
                      title={apartment.name}
                      description={apartment.description}
                      price={apartment.price}
                      location={apartment.location}
                      media={apartment.video_url || []}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No apartments available at the moment.</p>
              )}
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-gray-600">
              ⚙️ Resident Settings & Dashboard will be added soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}