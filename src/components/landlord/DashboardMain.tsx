"use client";

import { useRouter } from "next/navigation";
import WalletSummary from "./overview/WalletSummary";
import PaymentsOverview from "./overview/PaymentsOverview";
import PropertyAnalytics from "./overview/PropertyAnalytics";
import PropertyAccess from "./overview/PropertyAccess";
import { ListingDraft } from "./types";
import TenantInquiries from "./overview/TenantInquiries";

interface DashboardMainProps {
  listings: ListingDraft[];
  setListings: React.Dispatch<React.SetStateAction<ListingDraft[]>>;
}

export default function DashboardMain({ listings }: DashboardMainProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Landlord Dashboard Overview</h2>
        <button
          onClick={() => router.push("/landlord/add-listing")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
        <PropertyAnalytics listings={listings} views={{}} />
        <PropertyAccess listings={listings} />
      </div>
    </div>
  );
}
