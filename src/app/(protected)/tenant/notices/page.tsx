"use client";

import { useEffect, useState } from "react";
import { FiFile } from "react-icons/fi";
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

// --- Main Page ---
export default function TenantNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const tenantId = "tenant_1"; // Replace with dynamic auth/session

  // For Sidebar active menu
  const [activeMenu, setActiveMenu] = useState("Notice");

  useEffect(() => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored.reverse());
  }, []);

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
      {/* Sidebar with props */}
      <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#58181C] mb-8">Tenant Notices</h1>

          {notices.length === 0 && <p className="text-gray-500 text-lg">No notices available.</p>}

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
                            <img
                              key={idx}
                              src={file.dataUrl}
                              alt={file.name}
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
      </div>
    </div>
  );
}
