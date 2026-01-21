"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiPhone,
} from "react-icons/fi";
import TenantSidebar from "@/components/tenants/TenantSidebar";

// ---------------- Types ----------------
export type ComplaintStatus = "Open" | "In Review" | "Resolved";
export type ComplaintType =
  | "General Inquiry"
  | "Rent Issue"
  | "Maintenance Issue"
  | "Noise Complaint"
  | "Neighbour Conflict"
  | "Billing/Payments"
  | "Other";

export type ComplaintMessage = {
  id: number;
  sender: "tenant" | "landlord" | "support" | "system";
  text: string;
  timestamp: string;
};

export type Complaint = {
  id: number;
  title: string;
  listingTitle?: string;
  type: ComplaintType;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
  messages: ComplaintMessage[];
  escalatedTo?: "Support" | "Property Manager" | null;
};

// ---------------- Starter complaints ----------------
const starterComplaints: Omit<Complaint, "createdAt" | "messages">[] = [
  {
    id: 1001,
    title: "Water leak from upstairs",
    listingTitle: "Modern Apartment on Elm St",
    type: "Maintenance Issue",
    status: "Open",
    escalatedTo: null,
  },
  {
    id: 1002,
    title: "Loud parties every weekend",
    listingTitle: "Cozy Studio near Downtown",
    type: "Noise Complaint",
    status: "In Review",
    escalatedTo: "Property Manager",
  },
];

const complaintTypes: ComplaintType[] = [
  "General Inquiry",
  "Rent Issue",
  "Maintenance Issue",
  "Noise Complaint",
  "Neighbour Conflict",
  "Billing/Payments",
  "Other",
];

const statusOrder: ComplaintStatus[] = ["Open", "In Review", "Resolved"];

// ---------------- Helpers ----------------
const generateId = () =>
  typeof window !== "undefined" ? Date.now() + Math.floor(Math.random() * 999) : 0;

// ---------------- Main Component ----------------
export default function ComplaintsPage() {
  const [hydrated, setHydrated] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "All">("All");
  const [search, setSearch] = useState("");

  // New complaint form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ComplaintType>("General Inquiry");
  const [newListing, setNewListing] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Reply input for selected ticket
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ---------------- Hydration-safe initialization ----------------
  useEffect(() => {
    const saved = localStorage.getItem("renthub_complaints_v1");
    let loaded: Complaint[] = [];
    if (saved) {
      loaded = JSON.parse(saved);
    } else {
      loaded = starterComplaints.map((c) => ({
        ...c,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: generateId(),
            sender: "tenant",
            text:
              c.id === 1001
                ? "There's a steady drip in the bathroom ceiling since last night."
                : "Neighbors have loud music every weekend.",
            timestamp: new Date().toLocaleString(),
          },
          {
            id: generateId(),
            sender: c.id === 1001 ? "landlord" : "system",
            text:
              c.id === 1001
                ? "Thanks for reporting — I will arrange a plumber tomorrow morning."
                : "Your complaint was forwarded to Property Manager.",
            timestamp: new Date().toLocaleString(),
          },
        ],
      }));
    }
    setComplaints(loaded);
    setSelectedId(loaded[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("renthub_complaints_v1", JSON.stringify(complaints));
    }
  }, [complaints, hydrated]);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, complaints]);

  const selected = useMemo(
    () => complaints.find((c) => c.id === selectedId) ?? null,
    [complaints, selectedId]
  );

  const counts = useMemo(() => {
    const open = complaints.filter((c) => c.status === "Open").length;
    const inReview = complaints.filter((c) => c.status === "In Review").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    return { open, inReview, resolved };
  }, [complaints]);

  const filtered = complaints
    .filter((c) => (filterStatus === "All" ? true : c.status === filterStatus))
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.listingTitle ?? "").toLowerCase().includes(search.toLowerCase())
    );

  // ---------------- Actions ----------------
  function createComplaint(e?: React.FormEvent) {
    e?.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const c: Complaint = {
      id: generateId(),
      title: newTitle.trim(),
      listingTitle: newListing || undefined,
      type: newType,
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        { id: generateId(), sender: "tenant", text: newMessage.trim(), timestamp: new Date().toLocaleString() },
      ],
      escalatedTo: null,
    };

    setComplaints((prev) => [c, ...prev]);
    setNewTitle("");
    setNewListing("");
    setNewMessage("");
    setNewType("General Inquiry");
    setSelectedId(c.id);
  }

  function addReply(reply: string, sender: ComplaintMessage["sender"] = "tenant") {
    if (!selected || !reply.trim()) return;
    const msg: ComplaintMessage = { id: generateId(), sender, text: reply.trim(), timestamp: new Date().toLocaleString() };
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() }
          : c
      )
    );
    setReplyText("");
  }

  function escalateTo(target: "Support" | "Property Manager") {
    if (!selected) return;
    addReply(`Complaint escalated to ${target}.`, "system");
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, escalatedTo: target, status: "In Review", updatedAt: new Date().toISOString() }
          : c
      )
    );
  }

  function changeStatus(target: ComplaintStatus) {
    if (!selected) return;
    addReply(`Status changed to ${target}.`, "system");
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: target, updatedAt: new Date().toISOString() } : c
      )
    );
  }

  function quickResolve() {
    changeStatus("Resolved");
  }

  // ---------------- UI ----------------
  if (!hydrated) return null; // Prevent SSR mismatch

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar activeMenu="Complaints" setActiveMenu={() => {}} />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="min-h-[600px] h-full flex bg-white rounded-lg shadow overflow-hidden text-black">
          {/* Left column */}
          <div className="w-96 border-r p-4 bg-gray-50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "#58181C" }}>Complaints</h2>
              <div className="text-sm text-gray-600">
                Open: {counts.open} · In Review: {counts.inReview} · Resolved: {counts.resolved}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-md text-black"
                placeholder="Search by title or listing"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="All">All</option>
                {statusOrder.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* New complaint form */}
            <form onSubmit={createComplaint} className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <FiPlus className="text-gray-600" />
                <h3 className="text-sm font-semibold">Create Complaint</h3>
              </div>
              <input
                placeholder="Short title"
                className="w-full p-2 border border-gray-200 rounded mb-2 text-black"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                placeholder="Listing (optional)"
                className="w-full p-2 border border-gray-200 rounded mb-2 text-black"
                value={newListing}
                onChange={(e) => setNewListing(e.target.value)}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ComplaintType)}
                className="w-full p-2 border border-gray-200 rounded mb-2"
              >
                {complaintTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <textarea
                placeholder="Describe the issue..."
                rows={3}
                className="w-full p-2 border border-gray-200 rounded mb-2 text-black"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-3 py-2 bg-[#C81E1E] text-white rounded font-semibold hover:opacity-95">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => { setNewTitle(""); setNewListing(""); setNewMessage(""); setNewType("General Inquiry"); }}
                  className="px-3 py-2 border border-gray-300 rounded"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Tickets list */}
            <div className="flex-1 overflow-y-auto pt-1 space-y-2">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3 rounded-md cursor-pointer border ${selectedId === c.id ? "border-[#58181C] bg-white shadow" : "border-transparent hover:bg-gray-100"}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-black truncate" title={c.title}>{c.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{c.listingTitle ?? "No listing"} · {c.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${c.status === "Open" ? "text-green-700" : c.status === "In Review" ? "text-yellow-600" : "text-gray-500"}`}>{c.status}</div>
                      <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 truncate">{c.messages[c.messages.length - 1]?.text}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-sm text-gray-500">No complaints found.</div>}
            </div>

            {/* Compact help */}
            <div className="text-xs text-gray-600 border-t pt-3 mt-2">
              <div className="flex items-center gap-2"><FiUsers /> For urgent issues call support.</div>
              <div className="flex items-center gap-2 mt-1"><FiPhone /> +254 700 000 000 (example)</div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded hover:bg-gray-100"><FiChevronLeft /></button>
                <div>
                  <div className="text-sm text-gray-600">Ticket</div>
                  <div className="font-bold text-black">{selected ? selected.title : "No complaint selected"}</div>
                  <div className="text-xs text-gray-500">{selected ? `${selected.type} · ${selected.listingTitle ?? "No listing"}` : "Select or create a complaint to view details."}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selected && (
                  <>
                    <select value={selected.status} onChange={(e) => changeStatus(e.target.value as ComplaintStatus)} className="p-2 border border-gray-200 rounded">
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={() => escalateTo("Support")} className="px-3 py-2 bg-[#58181C] text-white rounded">Escalate to Support</button>
                    <button onClick={() => escalateTo("Property Manager")} className="px-3 py-2 bg-[#F4C542] text-black rounded">Escalate to Manager</button>
                    <button onClick={quickResolve} className="px-3 py-2 bg-green-600 text-white rounded">Resolve</button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left: ticket meta */}
              <div className="w-80 border-r p-4 bg-gray-50 overflow-y-auto">
                {selected ? (
                  <div className="space-y-3">
                    <div><div className="text-xs text-gray-500">Status</div><div className="font-semibold text-black">{selected.status}</div></div>
                    <div><div className="text-xs text-gray-500">Type</div><div className="font-semibold text-black">{selected.type}</div></div>
                    <div><div className="text-xs text-gray-500">Escalated To</div><div className="font-semibold text-black">{selected.escalatedTo ?? "—"}</div></div>
                    <div><div className="text-xs text-gray-500">Created</div><div className="font-semibold text-black">{new Date(selected.createdAt).toLocaleString()}</div></div>
                    <div><div className="text-xs text-gray-500">Last Updated</div><div className="font-semibold text-black">{selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : "—"}</div></div>
                  </div>
                ) : <div className="text-sm text-gray-500">Select a complaint to view details.</div>}
              </div>

              {/* Right: messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
                  {selected ? (
                    selected.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === "tenant" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] p-3 rounded-lg shadow ${m.sender === "tenant" ? "bg-[#C81E1E] text-white rounded-br-none" : m.sender === "system" ? "bg-gray-100 text-gray-800" : "bg-gray-200 text-gray-900"}`}>
                          <div className="text-sm">{m.text}</div>
                          <div className="text-xs text-gray-400 mt-1">{m.timestamp}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No messages yet.</div>
                  )}
                  <div ref={messagesEndRef}></div>
                </div>

                {selected && (
                  <div className="p-3 border-t flex gap-2">
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      onClick={() => addReply(replyText)}
                      className="px-4 py-2 bg-[#58181C] text-white rounded"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
