"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

import { colors } from "@/utils/colors";

// ---------------- Sidebar ----------------
type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

function TenantSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter();
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
    <nav
      className="flex-1 space-y-1 py-4"
      style={{ backgroundColor: colors.maroon }}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            onClick={onLinkClick}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-r-md transition-colors ${
              isActive
                ? "sidebar-btn border-r-2 border-blue-500 text-white bg-black/20"
                : "text-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {React.cloneElement(item.icon, {
              className: `mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`,
            })}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default TenantSidebar;
