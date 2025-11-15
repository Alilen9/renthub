"use client";

import React from "react";
import Link from "next/link";
import { Home, PlusCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const sidebarNavItems = [
    { href: "/landlord/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/landlord/property", label: "Properties", icon: <Building size={18} /> },
    { href: "/landlord/tenants", label: "Tenants", icon: <Users size={18} /> },
    { href: "/landlord/payment", label: "Payments", icon: <CreditCard size={18} /> },
    { href: "/landlord/maintenance", label: "Maintenance", icon: <Wrench size={18} /> }, // ✅ new
    { href: "/landlord/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const SignOut = () => {
    // Add sign-out logic here
    router.push("/");
  };

  return (
    <aside className="col-span-3 bg-white h-screen shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[#C81E1E] mb-8">RentHub</h2>
        <nav className="space-y-4 text-gray-700">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-sm font-medium hover:text-[#C81E1E] transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
