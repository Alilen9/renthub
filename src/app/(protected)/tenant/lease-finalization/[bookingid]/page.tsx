"use client";

import { useState } from "react";
import Link from "next/link";
import TenantSidebar from "@/components/tenants/TenantSidebar"; // ✅ import the sidebar
// Remove all the old sidebar code here

// ---------------- Move-In Card ----------------
type MoveInConfirmationCardProps = {
  bookingId: string;
  listingName: string;
  escrowAmount: number;
  ownerName: string;
  propertyAddress: string;
  propertyImageUrl: string;
  onConfirmRelease: (bookingId: string) => void;
};

function MoveInConfirmationCard({
  bookingId,
  listingName,
  escrowAmount,
  ownerName,
  propertyAddress,
  propertyImageUrl,
  onConfirmRelease,
}: MoveInConfirmationCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = () => {
    if (!isChecked) {
      alert("Please check the confirmation box to authorize the fund release.");
      return;
    }
    setIsReleasing(true);
    setTimeout(() => onConfirmRelease(bookingId), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 max-w-3xl mx-auto transition-transform hover:scale-[1.01]">
      {/* Property Image */}
      <div className="relative h-72 w-full">
        <img
          src={propertyImageUrl}
          alt={listingName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-5">
          <h2 className="text-white text-2xl font-semibold">{listingName}</h2>
          <p className="text-gray-300 text-sm">{propertyAddress}</p>
        </div>
      </div>

      {/* Escrow Details */}
      <div className="p-8 space-y-6">
        <p className="text-gray-800 leading-relaxed">
          You’re about to release your escrow deposit to the property owner.
          Please review the details carefully before confirming.
        </p>

        <div className="bg-[#F4C542]/10 p-5 rounded-xl border border-[#F4C542]/50">
          <p className="font-semibold text-gray-900 mb-2">
            Transaction Details
          </p>
          <div className="flex justify-between mt-1 text-gray-800">
            <span>Amount to be Released:</span>
            <span className="font-bold text-green-700 text-lg">
              ${escrowAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mt-1 text-gray-800">
            <span>Recipient:</span>
            <span className="font-semibold">{ownerName}</span>
          </div>
        </div>

        {/* Confirmation */}
        <div className="flex items-start">
          <input
            id="release-check"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            disabled={isReleasing}
            className="mt-1 h-5 w-5 text-[#C81E1E] border-gray-400 rounded focus:ring-[#C81E1E]"
          />
          <label htmlFor="release-check" className="ml-3 text-gray-900 text-sm">
            I confirm that the property matches the agreement and authorize the
            release of my deposit to <strong>{ownerName}</strong>.
          </label>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleRelease}
          disabled={!isChecked || isReleasing}
          className={`w-full mt-4 py-3 rounded-xl font-bold transition ${
            isChecked && !isReleasing
              ? "bg-[#C81E1E] text-white hover:bg-[#58181C]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isReleasing
            ? "Releasing Funds..."
            : "Finalize Move-in & Release Funds"}
        </button>
      </div>
    </div>
  );
}

// ---------------- Main Page ----------------
export default function LeaseFinalizationPage() {
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // ✅ Dummy data
  const dummyBooking = {
    bookingId: "BOOK12345",
    listingName: "Luxury 2-Bedroom Apartment • Balcony & Pool Access",
    escrowAmount: 1200,
    ownerName: "Acme Property Management Inc.",
    propertyAddress: "Westlands, Nairobi, Kenya",
    propertyImageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
  };

  const handleConfirmRelease = (id: string) => {
    console.log("Releasing funds for booking:", id);
    setTimeout(() => setReleaseSuccess(true), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Imported Sidebar */}
      <TenantSidebar setActiveMenu={setActiveMenu} activeMenu={""} />

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {releaseSuccess ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center bg-green-50 rounded-2xl border border-green-300 shadow-lg">
            <svg
              className="w-20 h-20 text-green-600 mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-3xl font-bold text-green-800 mb-3">
              Success! Lease Finalized.
            </h3>
            <p className="text-gray-700 mb-6 max-w-lg text-center">
              Your deposit has been successfully released to the landlord.
              Welcome to your new home!
            </p>
            <Link
              href="/tenant/dashboard"
              className="px-6 py-3 bg-[#C81E1E] text-white rounded-xl hover:bg-[#58181C] transition font-semibold"
            >
              Go to Tenant Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#58181C]">
                Finalize Lease Agreement
              </h1>
              <span className="text-sm text-gray-600">
                Booking ID: <strong>{dummyBooking.bookingId}</strong>
              </span>
            </div>

            <MoveInConfirmationCard
              bookingId={dummyBooking.bookingId}
              listingName={dummyBooking.listingName}
              escrowAmount={dummyBooking.escrowAmount}
              ownerName={dummyBooking.ownerName}
              propertyAddress={dummyBooking.propertyAddress}
              propertyImageUrl={dummyBooking.propertyImageUrl}
              onConfirmRelease={handleConfirmRelease}
            />
          </>
        )}
      </main>
    </div>
  );
}
