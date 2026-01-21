"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiKey,
  FiCalendar,
  FiAlertCircle,
  FiFile,
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
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

  const handleClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.name);
    router.push(item.path);
  };

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
