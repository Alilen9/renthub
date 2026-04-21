"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building,
  CreditCard,
  Settings,
  Users,
  Wrench,
  Bell,
  FileText,
  Briefcase
} from "lucide-react";

function AdminSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  const sidebarNavItems = [
    { href: "/landlord/dashboard", label: "Dashboard", icon: <Home /> },
    { href: "/landlord/property", label: "Properties", icon: <Building /> },
    { href: "/landlord/tenants", label: "Tenants", icon: <Users /> },
    { href: "/landlord/payment", label: "Payments", icon: <CreditCard /> },
    { href: "/landlord/maintenance", label: "Maintenance", icon: <Wrench /> },
    { href: "/landlord/notices", label: "Notices", icon: <Bell /> },
    { href: "/landlord/fairness", label: "Fairness & Transparency", icon: <FileText /> },
    { href: "/landlord/Service_providers", label: "Service Providers", icon: <Briefcase /> },
    { href: "/landlord/settings", label: "Settings", icon: <Settings /> },
  ];

  return (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-0">
      {sidebarNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-[#C81E1E] text-white shadow-md"
                : "text-gray-700 hover:bg-[#C81E1E]/10 hover:text-[#C81E1E]"
            }`}
          >
            {React.cloneElement(item.icon, {
              className: `h-4 w-4 ${isActive ? "text-black" : "text-gray-400"}`,
            })}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminSidebar;
