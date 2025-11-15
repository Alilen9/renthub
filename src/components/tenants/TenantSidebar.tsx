"use client";

import { useRouter } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiKey,
  FiCalendar,
  FiAlertCircle,
  FiFile,
} from "react-icons/fi";

type SidebarProps = {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
};

function TenantSidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/tenant/dashboard" },
    { name: "Finalize Move-in", icon: <FiKey />, path: "/tenant/lease-finalization/BKG12345" },
    { name: "Book a Viewing", icon: <FiCalendar />, path: "/tenant/booking-system" },
    { name: "Report Fault", icon: <FiAlertCircle />, path: "/tenant/maintainance" },
    { name: "Messages", icon: <FiMessageSquare />, path: "/tenant/chat" },
    { name: "Notices", icon: <FiFile />, path: "/tenant/notices" },
    { name: "Settings", icon: <FiSettings />, path: "/tenant/settings" },
  ];

  const handleClick = (item: typeof menuItems[0]) => {
    setActiveMenu(item.name);
    router.push(item.path);
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-white shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#C81E1E]">RentHub</h1>
        <p className="text-sm text-gray-500 mt-1">Your Rental Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition
              ${activeMenu === item.name
                ? "bg-[#C81E1E] text-white shadow-md"
                : "text-gray-700 hover:bg-[#C81E1E]/10 hover:text-[#C81E1E]"
              }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-[#C81E1E] transition"
          onClick={() => router.push("/")}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default TenantSidebar;
