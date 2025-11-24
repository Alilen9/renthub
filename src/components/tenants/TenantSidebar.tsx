"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiKey,
  FiCalendar,
} from "react-icons/fi";
import { LayoutDashboard, Users, Gift, Wallet, BarChart, Settings } from "lucide-react";
import { colors } from "@/utils/colors";



// ---------------- Sidebar ----------------
type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

function TenantSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const encodedListing = encodeURIComponent("Unit 4B - Riverwalk Lofts");
  const navItems = [
      { name: 'Dashboard', href: '/tenant/dashboard', icon: FiHome },
      { name: 'Fianlize-MoveIn', href: '/tenant/booking-system', icon: FiKey },
      { name: 'Booking', href: `/tenant/booking-system?listing=${encodedListing}`, icon: FiCalendar },
      { name: 'Messages', href: '/tenant/chat', icon: FiMessageSquare },
      { name: 'Support', href: '/tenant/support', icon: FiMessageSquare },
      { name: 'Settings', href: '/tenant/settings', icon: Settings },
  ];
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <nav
      className="flex-1 space-y-1 py-4"
      style={{ backgroundColor: colors.maroon }}
    >
      {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
              <Link
                  key={item.name}
                  href={item.href}
                  onClick={(onLinkClick)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-r-md transition-colors ${
                      isActive
                          ? 'sidebar-btn border-r-2 border-blue-500'
                          : 'text-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                  <item.icon
                      className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  {item.name}
              </Link>
          );
      })}

      
    </nav>
  );
}

export default TenantSidebar;
