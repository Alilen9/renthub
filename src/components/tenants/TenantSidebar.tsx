"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiKey,
  FiCalendar,
  FiAlertCircle, // New icon for Report Fault
} from "react-icons/fi";

// 🎨 RentHub Brand Colors
const colors = {
  maroon: "#58181C",
  red: "#C81E1E",
  yellow: "#F4C542",
};

// ---------------- Sidebar ----------------
type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

function TenantSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    setActiveMenu("Dashboard");
    router.push("/tenant/dashboard");
  };

  const handleMoveInConfirmation = () => {
    router.push(`/tenant/lease-finalization/BKG12345`);
  };

  const handleBookingClick = () => {
    setActiveMenu("Booking");
    const encodedListing = encodeURIComponent("Unit 4B - Riverwalk Lofts");
    router.push(`/tenant/booking-system?listing=${encodedListing}`);
  };

  const handleMessagesClick = () => {
    setActiveMenu("Messages");
    router.push("/tenant/chat");
  };

  const handleSettingsClick = () => {
    setActiveMenu("Settings");
    router.push("/tenant/settings");
  };

  const handleReportFaultClick = () => {
    setActiveMenu("Report Fault");
    // Path to your maintenance page
    router.push("/tenant/maintainance");
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col shadow-lg"
      style={{ backgroundColor: colors.maroon }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#C81E1E]/50">
        <h1 className="text-2xl font-bold" style={{ color: colors.yellow }}>
          RentHub
        </h1>
        <p className="text-sm text-gray-300 mt-1">Your Rental Dashboard</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-3">
        <button
          onClick={handleDashboardClick}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Dashboard"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiHome /> <span>Dashboard</span>
        </button>

        <button
          onClick={handleMoveInConfirmation}
          className="flex items-center gap-3 w-full p-3 rounded-lg font-medium bg-[#F4C542] text-[#58181C] hover:bg-[#F4C542]/90 transition shadow-md"
        >
          <FiKey /> <span>Finalize Move-in</span>
        </button>

        <button
          onClick={handleBookingClick}
          className="flex items-center gap-3 w-full p-3 rounded-lg font-medium bg-[#C81E1E]/90 text-white hover:bg-[#C81E1E] transition shadow-md"
        >
          <FiCalendar /> <span>Book a Viewing</span>
        </button>

        {/* New Report Fault Button */}
        <button
          onClick={handleReportFaultClick}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Report Fault"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiAlertCircle /> <span>Report Fault</span>
        </button>

        <button
          onClick={handleMessagesClick}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Messages"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiMessageSquare /> <span>Messages</span>
        </button>

        <button
          onClick={handleSettingsClick}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Settings"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiSettings /> <span>Settings</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#C81E1E]/50">
        <button
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-300 hover:bg-[#C81E1E]/70 hover:text-white transition"
          onClick={() => router.push("/")}
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default TenantSidebar;
