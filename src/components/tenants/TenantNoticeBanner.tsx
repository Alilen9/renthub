"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Priority = "Normal" | "Important" | "Urgent";

type Notice = {
  id: string;
  title: string;
  priority: Priority;
  createdAt: string;
  readBy: string[];
};

export default function TenantNoticeBanner() {
  const [unreadNotices, setUnreadNotices] = useState<Notice[]>([]);
  const tenantId = "tenant_1"; // Replace with dynamic auth ID from auth/session

  const loadNotices = () => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    const unread = stored.filter((n) => !n.readBy.includes(tenantId));
    setUnreadNotices(unread);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // Sort by priority
  const priorityOrder: Record<Priority, number> = { Urgent: 3, Important: 2, Normal: 1 };
  const sorted = [...unreadNotices].sort(
    (a, b) => (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1)
  );
  const topNotice = sorted[0];

  const bannerColor =
    topNotice.priority === "Urgent"
      ? "bg-red-600 text-white"
      : topNotice.priority === "Important"
      ? "bg-yellow-400 text-black"
      : "bg-[#F4C542] text-black";

  const markAsRead = () => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    const updated = stored.map((n) => {
      if (n.id === topNotice.id) {
        return { ...n, readBy: [...n.readBy, tenantId] };
      }
      return n;
    });
    localStorage.setItem("notices", JSON.stringify(updated));
    loadNotices(); // Refresh unread notices
  };

  return (
    <div className={`${bannerColor} p-4 rounded mb-6 flex justify-between items-center shadow-md`}>
      <div>
        <strong>{unreadNotices.length} new {unreadNotices.length === 1 ? "notice" : "notices"}</strong>
        {topNotice.priority !== "Normal" && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-white text-black">
            {topNotice.priority}
          </span>
        )}
        <p className="mt-1">{topNotice.title}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={markAsRead}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Mark as Read
        </button>

        <Link
          href="/tenant/notices"
          className="bg-[#C81E1E] text-white px-3 py-1 rounded hover:bg-[#58181C] transition"
        >
          View Notices
        </Link>
      </div>
    </div>
  );
}
