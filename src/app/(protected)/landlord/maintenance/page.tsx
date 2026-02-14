"use client";

import React from "react";
import LandlordFaults from "@/components/landlord/LandlordFaults";

export default function LandlordDashboardPage() {
  return (
    <div className="min-h-screen bg-maroon/10">
      {/* Header */}
      <header className="bg-maroon text-white p-6 shadow">
        <h1 className="text-3xl  text-black font-bold">Maintenance & Fault Management</h1>
        <p className="text-black mt-1">View, assign, and resolve tenant faults</p>
      </header>

      {/* Content */}
      <main className="p-6">
        <LandlordFaults />
      </main>
    </div>
  );
}
