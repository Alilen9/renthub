"use client";

import { Home, Wrench, Settings, LogOut, FileText, MessageSquare, Wallet, HelpCircle, FileCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // to detect active route

export default function SPNSidebar() {
  const router = useRouter();
  const pathname = usePathname(); // current path

  const sidebarNavItems = [
    { href: "/spn/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/spn/tasks", label: "Tasks", icon: <Wrench size={18} /> },
    { href: "/spn/profile", label: "Profile", icon: <FileText size={18} /> },
     { href: "/spn/messages", label: "Messages", icon: <MessageSquare size={18} /> },
    { href: "/spn/wallet", label: "Wallet", icon: <Wallet size={18} /> },
  {href: "/spn/verification", label: "Verification", icon: <FileCheck size={18} /> },
  {href: "/spn/help", label: "Help Center", icon: <HelpCircle size={18} /> },

    { href: "/spn/settings", label: "Settings", icon: <Settings size={18} /> },

  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/"); // replace to prevent back navigation
  };

  return (
    <aside className="w-64 flex flex-col bg-white shadow-md min-h-screen text-black">
  {/* Header */}
  <div className="px-4 py-6 border-b border-gray-200">
    <h2 className="text-2xl font-bold text-indigo-600">SP Network</h2>
  </div>

  {/* Navigation */}
  <nav className="flex-1 flex flex-col px-2 py-4 gap-2">
    {sidebarNavItems.map((item) => {
      const isActive = pathname === item.href;
      return (
        <button
          key={item.href}
          onClick={() => router.push(item.href)}
          className={`flex items-center gap-3 w-full p-2 rounded font-medium transition
            ${isActive
              ? "bg-indigo-100 text-indigo-700 shadow-inner"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      );
    })}
  </nav>

  {/* Logout */}
  <div className="px-4 py-6 border-t border-gray-200">
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 w-full p-2 rounded text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
    >
      <LogOut size={18} /> Logout
    </button>
  </div>
</aside>

  );
}
