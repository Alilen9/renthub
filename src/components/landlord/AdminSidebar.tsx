// src/components/landlord/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Home, PlusCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const sidebarNavItems = [
    { href: "/landlord/dashboard", label: "Dashboard" },
    
    { href: "/landlord/property", label: "Properties" },
   { href: "/landlord/tenants", label: "Tenants" },
    { href: "/landlord/payment", label: "Payments" },
    { href: "/landlord/settings", label: "Settings" },
  ];

  const SignOut = () => {
    // Add sign-out logic here
    router.push("/");
  };

  return (
    <aside className="col-span-3 bg-white h-screen shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-rose-600 mb-8"> RentHub</h2>
        <nav className="space-y-4 text-gray-700">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 hover:text-rose-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-2 text-gray-600 hover:text-red-600"
      onClick={SignOut}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
