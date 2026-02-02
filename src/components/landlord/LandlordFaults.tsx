"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Fault, FaultStatus } from "@/types/fault";
import { Send, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Tunyce brand colors
const TUNYCE_MAROON = "#58181C";
const TUNYCE_RED = "#C81E1E";
const TUNYCE_YELLOW = "#F4C542";

const initialFaults: Fault[] = [
  {
    id: "f_1",
    title: "Leaking Sink",
    category: "Plumbing",
    description: "Kitchen sink leaking from pipes.",
    status: "Pending",
    tenantName: "Alice Mkangoma",
    tenantEmail: "alice.mkangoma@example.com",
    tenantPhone: "0113336555",
    unitNumber: "A-101",
    propertyType: "Apartment",
    propertyArea: "Ruiru",
    mediaUrl: "https://images.unsplash.com/photo-1617874466326-f8245c1b76c0?auto=format&fit=crop&w=800&q=80",
    dateReported: new Date().toISOString(),
    messages: [],
    priority: "High",
    serviceProviderProgress: 0,
    expectedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "f_2",
    title: "Broken Light",
    category: "Electrical",
    description: "Hallway light not working.",
    status: "Assigned",
    tenantName: "John Doe",
    tenantEmail: "john.doe@example.com",
    tenantPhone: "0113336666",
    unitNumber: "B-202",
    propertyType: "Apartment",
    propertyArea: "Ruiru",
    mediaUrl: "https://images.unsplash.com/photo-1581091870625-26770a2043a0?auto=format&fit=crop&w=800&q=80",
    dateReported: new Date().toISOString(),
    messages: [],
    priority: "Medium",
    serviceProvider: "Electrician Mike",
    serviceProviderProgress: 50,
    expectedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "f_3",
    title: "Clogged Toilet",
    category: "Plumbing",
    description: "Toilet clogged in Unit C-303.",
    status: "Resolved",
    tenantName: "Jane Smith",
    tenantEmail: "jane.smith@example.com",
    tenantPhone: "0113337777",
    unitNumber: "C-303",
    propertyType: "Apartment",
    propertyArea: "Ruiru",
    mediaUrl: "https://images.unsplash.com/photo-1616633723892-9f19a4fc6b3d?auto=format&fit=crop&w=800&q=80",
    dateReported: new Date().toISOString(),
    messages: [],
    priority: "High",
    serviceProvider: "Plumber Sam",
    serviceProviderProgress: 100,
    expectedCompletion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function LandlordFaults() {
  const [faults, setFaults] = useState<Fault[]>(initialFaults);
  const [filterStatus, setFilterStatus] = useState<FaultStatus | "All">("All");
  const [messageInputs, setMessageInputs] = useState<{ [key: string]: string }>({});
  const [modalMedia, setModalMedia] = useState<string | null>(null);

  const analyticsData = useMemo(() => {
    const pending = faults.filter(f => f.status === "Pending").length;
    const assigned = faults.filter(f => f.status === "Assigned").length;
    const resolved = faults.filter(f => f.status === "Resolved").length;
    return [
      { name: "Pending", value: pending, color: TUNYCE_YELLOW },
      { name: "Assigned", value: assigned, color: TUNYCE_RED },
      { name: "Resolved", value: resolved, color: TUNYCE_MAROON },
    ];
  }, [faults]);

  const filteredFaults = useMemo(() => {
    if (filterStatus === "All") return faults;
    return faults.filter(f => f.status === filterStatus);
  }, [filterStatus, faults]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _assignServiceProvider = (id: string) => {
    const provider = prompt("Enter Service Provider Name (Plumber, Electrician, etc.)");
    if (!provider) return;
    setFaults(faults.map(f =>
      f.id === id
        ? {
            ...f,
            status: "Assigned" as const,
            serviceProvider: provider,
            serviceProviderProgress: 0,
            expectedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            messages: [...(f.messages || []), { sender: "Landlord" as const, content: `Assigned ${provider} to fix this.`, timestamp: new Date().toISOString() }],
          }
        : f
    ));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _updateProgress = (id: string, value: number) => {
    setFaults(faults.map(f =>
      f.id === id ? { ...f, serviceProviderProgress: value ?? 0 } : f
    ));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _resolveFault = (id: string) => {
    setFaults(faults.map(f =>
      f.id === id
        ? {
            ...f,
            status: "Resolved" as const,
            serviceProviderProgress: 100,
            messages: [...(f.messages || []), { sender: "Landlord" as const, content: "Issue resolved.", timestamp: new Date().toISOString() }],
          }
        : f
    ));
  };

  const sendMessage = (id: string) => {
    const content = messageInputs[id];
    if (!content) return;
    const updated = faults.map(f =>
      f.id === id
        ? { ...f, messages: [...(f.messages || []), { sender: "Landlord" as const, content, timestamp: new Date().toISOString() }] }
        : f
    );
    setFaults(updated);
    setMessageInputs(prev => ({ ...prev, [id]: "" }));

    // Auto reply
    setTimeout(() => {
      setFaults(prev => prev.map(f =>
        f.id === id
          ? { ...f, messages: [...(f.messages || []), { sender: "Tenant" as const, content: "Thanks for the update! Will check.", timestamp: new Date().toISOString() }] }
          : f
      ));
    }, 1500);
  };

  const statusColor = (status: FaultStatus) => {
    switch (status) {
      case "Pending": return `bg-yellow-100 text-black`;
      case "Assigned": return `bg-red-100 text-black`;
      case "Resolved": return `bg-gray-200 text-black`;
    }
  };

  const priorityColor = (priority?: string) => {
    switch (priority) {
      case "High": return `bg-gradient-to-r from-[#C81E1E] to-[#58181C] text-black`;
      case "Medium": return `bg-gradient-to-r from-[#F4C542] to-[#F4C542] text-black`;
      case "Low": return "bg-green-200 text-black";
      default: return "bg-gray-100 text-black";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _progressColor = (value: number) => {
    if (value < 40) return `bg-red-600`;
    if (value < 70) return `bg-yellow-400`;
    return `bg-maroon`;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _progressLabel = (value: number) => {
    if (value === 0) return "Assigned";
    if (value < 50) return "In Progress";
    if (value < 100) return "Almost Done";
    return "Resolved";
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen text-black">
      <h2 className="text-3xl font-bold mb-6 text-maroon"> Faults Dashboard</h2>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["All", "Pending", "Assigned", "Resolved"] as (FaultStatus | "All")[]).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filterStatus === status
                ? `bg-gradient-to-r from-[#58181C] to-[#C81E1E] text-white shadow-md`
                : `bg-white text-black border border-gray-300`
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {analyticsData.map((a, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center">
            <div className="font-medium mb-2">{a.name}</div>
            <div className="text-2xl font-bold mb-2">{a.value}</div>
            <div className="w-full h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[a]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={20}
                    outerRadius={40}
                    startAngle={90}
                    endAngle={450}
                  >
                    <Cell key={`cell-${a.name}`} fill={a.color} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Fault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaults.map(f => (
          <div key={f.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-maroon">{f.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColor(f.priority)}`}>
                {f.priority || "Low"} Priority
              </span>
            </div>

            <div className="mb-2">{f.description}</div>
            <div className="text-sm mb-1">
              <span className="font-medium">Tenant:</span> {f.tenantName} | <span className="font-medium">Unit:</span> {f.unitNumber} | <span className="font-medium">Property:</span> {f.propertyType} - {f.propertyArea}
            </div>

            {f.mediaUrl && (
              <Image
                src={f.mediaUrl}
                alt="Evidence"
                className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer hover:scale-105 transition-transform"
                width={400} height={200}
                onClick={() => setModalMedia(f.mediaUrl!)}
              />
            )}

            {/* Chat Box */}
            <div className="flex flex-col bg-gray-50 border rounded-lg p-3 max-h-48 overflow-y-auto gap-2 mb-4">
              {(f.messages || []).map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl max-w-[85%] self-${m.sender === "Landlord" ? "end" : "start"} shadow-sm ${
                    m.sender === "Landlord" ? "bg-yellow-100" : "bg-gray-200"
                  }`}
                >
                  <div className="text-xs font-medium mb-1">{m.sender}</div>
                  <div className="text-sm">{m.content}</div>
                  <div className="text-xs mt-1 text-gray-400">{new Date(m.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>

            {/* Chat Input FIXED */}
            <div className="flex items-center gap-0 mt-2 w-full">
              <input
                type="text"
                value={messageInputs[f.id] || ""}
                onChange={e => setMessageInputs(prev => ({ ...prev, [f.id]: e.target.value }))}
                placeholder="Type message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-xl focus:ring-maroon focus:border-maroon text-black bg-white"
              />
              <button
                onClick={() => sendMessage(f.id)}
                className="px-4 py-2 rounded-r-xl bg-gradient-to-r from-[#C81E1E] to-[#58181C] text-white flex items-center justify-center hover:opacity-90 transition h-full"
              >
                <Send size={16} />
              </button>
            </div>

            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor(f.status)}`}>
              {f.status}
            </span>
          </div>
        ))}
      </div>

      {/* Media Modal */}
      {modalMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative">
            <button onClick={() => setModalMedia(null)} className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700">
              <X size={20} />
            </button>

            {modalMedia.endsWith(".mp4") ? (
              <video controls className="max-h-[80vh] max-w-[80vw] rounded-lg">
                <source src={modalMedia} type="video/mp4" />
              </video>
            ) : (
              <Image src={modalMedia} alt="Evidence" width={800} height={600} className="max-h-[80vh] max-w-[80vw] rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
