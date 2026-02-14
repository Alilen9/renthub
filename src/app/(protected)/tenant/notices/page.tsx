"use client";

import { useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";
import Image from "next/image";
import TenantSidebar from "@/components/tenants/TenantSidebar";

// --- Notice Types ---
type NoticeFile = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

type Notice = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  assignedStaff: string[];
  files?: NoticeFile[];
  createdAt: string;
  readBy: string[];
};

// --- Property & Tenant Types ---
type Property = {
  id: string;
  name: string;
  managerApproved: boolean;
};

type Tenant = {
  id: string;
  name: string;
  properties: Property[];
};

// --- Main Page ---
export default function TenantNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [tenant] = useState<Tenant | null>({
    id: "tenant_1",
    name: "Alice",
    properties: [
      { id: "prop_1", name: "Sunrise Apartments", managerApproved: false },
      { id: "prop_2", name: "Green Villas", managerApproved: true },
    ],
  });
  const tenantId = tenant?.id || "tenant_1";

  // Load notices from localStorage
  useEffect(() => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored.reverse());
  }, []);

  // Toggle read/unread status
  const toggleRead = (id: string) => {
    const updated = notices.map((n) => {
      if (n.id === id) {
        const isRead = n.readBy.includes(tenantId);
        const updatedReadBy = isRead
          ? n.readBy.filter((tid) => tid !== tenantId)
          : [...n.readBy, tenantId];
        return { ...n, readBy: updatedReadBy };
      }
      return n;
    });
    setNotices(updated);
    localStorage.setItem("notices", JSON.stringify(updated.reverse()));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
        {/* Step 3: Select Property */}
        {!selectedProperty && (
          <div className="flex flex-col justify-center items-center min-h-full text-black">
            <h2 className="text-2xl font-bold mb-4">Select Your Property</h2>
            <div className="flex flex-col gap-3">
              {tenant?.properties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className="px-6 py-3 bg-[#58181C] text-white rounded-lg hover:bg-[#C81E1E] transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Waiting for manager approval */}
        {selectedProperty && !selectedProperty.managerApproved && (
          <div className="flex flex-col justify-center items-center min-h-full text-black">
            <h2 className="text-xl font-bold mb-2">Waiting for Property Manager Approval</h2>
            <p>Your property manager must approve your account before you can access notices.</p>
            <p className="mt-4 text-gray-500">
              Once approved, you can log in again to access this page.
            </p>
          </div>
        )}

        {/* Step 5: Notices Dashboard */}
        {selectedProperty && selectedProperty.managerApproved && (
          <div className="w-full">
            <h1 className="text-3xl font-bold text-[#58181C] mb-8">Tenant Notices</h1>

            {notices.length === 0 && (
              <p className="text-gray-500 text-lg">No notices available.</p>
            )}

            <div className="space-y-6">
              {notices.map((n) => {
                const isRead = n.readBy.includes(tenantId);

                return (
                  <div
                    key={n.id}
                    className={`p-6 rounded-2xl shadow-lg border transition-all flex flex-col gap-4
                      ${isRead
                        ? "bg-white border-gray-200"
                        : "bg-gradient-to-r from-[#FFF6E5] to-[#FFE8B0] border-red-300"
                      }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <h2 className="text-xl font-semibold text-[#58181C]">{n.title}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          n.priority === "Urgent"
                            ? "bg-[#C81E1E] text-white"
                            : n.priority === "Important"
                            ? "bg-[#F4C542] text-black"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {n.priority || "Normal"}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 text-base">{n.message}</p>

                    {/* Category */}
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          n.category === "General"
                            ? "bg-[#F4C542] text-black"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {n.category || "General"}
                      </span>
                    </div>

                    {/* Files */}
                    {n.files && n.files.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {n.files.map((file, idx) => {
                          if (file.type.startsWith("image/") && file.dataUrl) {
                            return (
                              <Image
                                key={idx}
                                src={file.dataUrl}
                                alt={file.name}
                                width={112} height={112}
                                className="w-28 h-28 object-cover rounded-xl border"
                              />
                            );
                          } else if (file.type === "application/pdf") {
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl shadow-sm"
                              >
                                <FiFile className="text-gray-600" />
                                <span className="text-sm font-medium">{file.name}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-2">
                      <p className="text-xs text-gray-400">
                        Posted on: {new Date(n.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => toggleRead(n.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isRead
                            ? "bg-gray-400 text-white hover:bg-gray-500"
                            : "bg-[#C81E1E] text-white hover:bg-[#58181C]"
                        }`}
                      >
                        {isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
