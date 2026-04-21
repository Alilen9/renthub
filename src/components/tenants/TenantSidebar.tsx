"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiKey,
  FiCalendar,
  FiAlertCircle,
  FiFile,
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";


function TenantSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/tenant/dashboard" },
    { name: "Finalize Move-in", icon: <FiKey />, path: "/tenant/lease-finalization/BKG12345" },
    { name: "Book a Viewing", icon: <FiCalendar />, path: "/tenant/booking-system" },
    { name: "Report Fault", icon: <FiAlertCircle />, path: "/tenant/maintainance" },
    { name: "Messages", icon: <FiMessageSquare />, path: "/tenant/chat" },
    { name: "Notices", icon: <FiBell />, path: "/tenant/notices" },
    { name: "Complain", icon: <FiAlertTriangle />, path: "/tenant/complain" },
    { name: "TenantAnalytics", icon: <FiBarChart2 />, path: "/tenant/TenantAnalytics" },
    { name: "Fairnesspolicy", icon: <FiFile />, path: "/tenant/fairness" },
    { name: "Settings", icon: <FiSettings />, path: "/tenant/settings" },
  ];

  return (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-0">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            onClick={onLinkClick}
            className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-[#C81E1E] text-white shadow-md"
                : "text-gray-700 hover:bg-[#C81E1E]/10 hover:text-[#C81E1E]"
            }`}
          >
            {React.cloneElement(item.icon, {
              className: `h-4 w-4 ${isActive ? "text-black" : "text-gray-400 group-hover:text-gray-500"}`,
            })}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default TenantSidebar;
