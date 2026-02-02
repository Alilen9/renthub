"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ---------------- Types ----------------
type LeaseFormData = {
  tenantName: string;
  tenantContact: string;
  leaseStart: string;
  leaseDurationMonths: number;
};

type Property = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  rentAmount: number;
  landlordName: string;
};

// ---------------- Move-In & Lease Form Card ----------------
function MoveInLeaseCard({
  bookingId,
  property,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  escrowAmount: _escrowAmount,
  onConfirmRelease,
}: {
  bookingId: string;
  property: Property;
  escrowAmount: number;
  onConfirmRelease: (bookingId: string, leaseData: LeaseFormData) => void;
}) {
  const [leaseData, setLeaseData] = useState<LeaseFormData>({
    tenantName: "",
    tenantContact: "",
    leaseStart: "",
    leaseDurationMonths: 12,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = () => {
    if (!leaseData.tenantName || !leaseData.tenantContact || !leaseData.leaseStart) {
      alert("Please fill all lease agreement fields before confirming.");
      return;
    }
    if (!isChecked) {
      alert("Please confirm before releasing escrow.");
      return;
    }
    setIsReleasing(true);
    setTimeout(() => onConfirmRelease(bookingId, leaseData), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Property Preview */}
      <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <Image src={property.imageUrl} alt={property.name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-5">
          <h2 className="text-white text-2xl font-semibold">{property.name}</h2>
          <p className="text-gray-300 text-sm">{property.address}</p>
          <p className="text-gray-200 mt-1 font-bold">${property.rentAmount.toLocaleString()} / month</p>
        </div>
      </div>

      {/* Lease Agreement Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-xl font-bold text-[#58181C]">Fill Lease Agreement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={leaseData.tenantName}
              onChange={(e) => setLeaseData({ ...leaseData, tenantName: e.target.value })}
              placeholder="Your Full Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#C81E1E] focus:border-[#C81E1E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email/Phone</label>
            <input
              type="text"
              value={leaseData.tenantContact}
              onChange={(e) => setLeaseData({ ...leaseData, tenantContact: e.target.value })}
              placeholder="Email or Phone"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#C81E1E] focus:border-[#C81E1E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lease Start Date</label>
            <input
              type="date"
              value={leaseData.leaseStart}
              onChange={(e) => setLeaseData({ ...leaseData, leaseStart: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#C81E1E] focus:border-[#C81E1E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lease Duration (Months)</label>
            <input
              type="number"
              min={1}
              value={leaseData.leaseDurationMonths}
              onChange={(e) => setLeaseData({ ...leaseData, leaseDurationMonths: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#C81E1E] focus:border-[#C81E1E]"
            />
          </div>
        </div>

        {/* Live Lease Agreement Preview */}
        <div className="mt-6 p-5 border border-gray-300 rounded-xl bg-gray-50">
          <h4 className="text-lg font-bold text-[#C81E1E] mb-2">Lease Agreement Preview</h4>
          <p className="text-gray-800 text-sm"><strong>Tenant:</strong> {leaseData.tenantName || "[Your Name]"}</p>
          <p className="text-gray-800 text-sm"><strong>Contact:</strong> {leaseData.tenantContact || "[Email/Phone]"}</p>
          <p className="text-gray-800 text-sm"><strong>Property:</strong> {property.name}, {property.address}</p>
          <p className="text-gray-800 text-sm"><strong>Rent Amount:</strong> ${property.rentAmount.toLocaleString()} per month</p>
          <p className="text-gray-800 text-sm"><strong>Lease Start:</strong> {leaseData.leaseStart || "[Start Date]"}</p>
          <p className="text-gray-800 text-sm"><strong>Lease Duration:</strong> {leaseData.leaseDurationMonths} months</p>
          <p className="text-gray-800 text-sm mt-2">
            <strong>Deposit:</strong> Held in escrow until lease completion.
          </p>
          <p className="text-gray-800 text-sm mt-2">
            By confirming below, tenant authorizes the release of escrow to <strong>{property.landlordName}</strong> and accepts the lease terms.
          </p>
        </div>

        {/* Confirmation */}
        <div className="flex items-start mt-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 h-5 w-5 text-[#C81E1E] border-gray-400 rounded focus:ring-[#C81E1E]"
          />
          <label className="ml-3 text-gray-900 text-sm">
            I have reviewed and agree to the lease agreement.
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleRelease}
          disabled={!isChecked || isReleasing}
          className={`w-full mt-4 py-3 rounded-xl font-bold transition ${
            isChecked && !isReleasing ? "bg-[#C81E1E] text-white hover:bg-[#58181C]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isReleasing ? "Processing..." : "Finalize Lease & Release Funds"}
        </button>
      </div>
    </div>
  );
}

// ---------------- Main Page ----------------
export default function LeaseFinalizationPage() {
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  const selectedProperty: Property = {
    id: "PROP12345",
    name: "Luxury 2-Bedroom Apartment • Balcony & Pool Access",
    address: "Westlands, Nairobi, Kenya",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    rentAmount: 1200,
    landlordName: "Acme Property Management Inc.",
  };

  const handleConfirmRelease = (bookingId: string, leaseData: LeaseFormData) => {
    localStorage.setItem("leaseData", JSON.stringify({ property: selectedProperty, leaseData }));
    localStorage.setItem("isResident", "true");
    setTimeout(() => setReleaseSuccess(true), 1200);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <main className="flex-1 p-10 overflow-y-auto">
        {releaseSuccess ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center bg-green-50 rounded-2xl border border-green-300 shadow-lg">
            <h3 className="text-3xl font-bold text-green-800 mb-3">Success! Lease Finalized.</h3>
            <p className="text-gray-700 mb-6 max-w-lg text-center">
              Your deposit has been successfully released to the landlord.
              Welcome to your new home!
            </p>
            <Link href="/tenant/dashboard" className="px-6 py-3 bg-[#C81E1E] text-white rounded-xl hover:bg-[#58181C] transition font-semibold">
              Go to Tenant Dashboard
            </Link>
          </div>
        ) : (
          <MoveInLeaseCard
            bookingId="BOOK12345"
            property={selectedProperty}
            escrowAmount={selectedProperty.rentAmount}
            onConfirmRelease={handleConfirmRelease}
          />
        )}
      </main>
    </div>
  );
}
