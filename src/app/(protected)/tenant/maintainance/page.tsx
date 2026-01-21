"use client";

import TenantFaults from "@/components/tenants/TenantFaults";
import TenantSidebar from "@/components/tenants/TenantSidebar"; // import your sidebar
import React, { useState } from "react";

export default function TenantDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("Dashboard"); // track active menu

  const tenant = {
    id: "1",
    name: "Alice Mkangoma",
    email: "mkangomaalice@gmail.com",
    phone: "0113336555",
    houseNumber: "A12",
    propertyType: "Apartment",
    propertyArea: "Ruiru",
    rentStatus: "Paid",
    moveInDate: "2024-11-01",
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-maroon text-white p-6 shadow">
          
          <p className="text-black mt-1">Report and track your maintenance faults</p>
        </header>

        <main className="p-6">
          <TenantFaults tenant={tenant} />
        </main>
      </div>
    </div>
  );
}
