"use client";

import React, { useEffect, useState } from "react";
import MessagesPanel from "./MessagesPanel";
import { Message } from "./types";

export default function DashboardSidebar({ setCreateOpen }: { setCreateOpen: (v: boolean) => void }) {
  const [analytics, setAnalytics] = useState({ views: 0, saves: 0, inquiries: 0 });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setAnalytics({ views: 128, saves: 12, inquiries: 7 });
    setMessages([
      { id: "1", from: "Tenant A", body: "Is the house still available?", time: "2025-09-28T10:00:00Z" },
      { id: "2", from: "Tenant B", body: "Can we schedule a viewing this Saturday?", time: "2025-09-27T15:30:00Z" },
    ]);
  }, []);

  return (
    <aside className="col-span-3 bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="text-black font-semibold mb-4">Landlord dashboard</h2>
      <button
        onClick={() => setCreateOpen(true)}
        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-700  text-white font-medium"
      >
        + Create Listing
      </button>

      <div className="mt-6">
        <h3 className="font-medium text-black">Quick stats</h3>
        <div className="mt-3 space-y-2 text-black">
          <div className="flex justify-between"><span>Views</span><strong>{analytics.views}</strong></div>
          <div className="flex justify-between"><span>Saves</span><strong>{analytics.saves}</strong></div>
          <div className="flex justify-between"><span>Inquiries</span><strong>{analytics.inquiries}</strong></div>
        </div>
      </div>

      <MessagesPanel messages={messages} />
    </aside>
  );
}
