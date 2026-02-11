"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WalletSummary from "./overview/WalletSummary";
import PaymentsOverview from "./overview/PaymentsOverview";
import PropertyAnalytics from "./overview/PropertyAnalytics";
import PropertyAccess from "./overview/PropertyAccess";
import TenantInquiries from "./overview/TenantInquiries";
import { fetchLandlordProperties } from "@/services/houseService";
import { Apartment } from "@/utils";
import toast from "react-hot-toast";

export default function DashboardMain() {
  const router = useRouter();
  const [listings, setListings] = useState<Apartment[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchLandlordProperties();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast.error("Failed to load dashboard data");
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Landlord Dashboard Overview</h2>
        <button
          onClick={() => router.push("/landlord/add-listing")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Property
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WalletSummary />
        <PaymentsOverview />
        <TenantInquiries />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* @ts-ignore */}
        <PropertyAnalytics listings={listings} views={{}} />
        {/* @ts-ignore */}
        <PropertyAccess listings={listings} />
      </div>
    </div>
  );
}
