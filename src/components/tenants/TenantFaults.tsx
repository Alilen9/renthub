"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ---------------- Types ----------------
export type FaultMessage = {
  sender: "Tenant" | "Landlord" | "System";
  content: string;
  timestamp: string;
  mediaUrl?: string;
};

export type Fault = {
  id: string;
  title: string;
  category: string;
  location?: string;
  description: string;
  status: "Pending" | "Assigned" | "In Progress" | "Resolved";
  priority: "High" | "Medium" | "Low";
  dateReported: string;
  tenantId: string;
  propertyId: string;
  landlordId: string;
  agencyId?: string;
  estimatedArrival?: string;
  serviceProvider?: { name: string; contact?: string };
  mediaUrls?: string[];
  messages?: FaultMessage[];
  rating?: number;
  feedback?: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property?: {
    id: string;
    name: string;
    type?: string;
    area?: string;
    landlord: {
      id: string;
      name: string;
      contact?: string;
    };
    agency?: {
      id: string;
      name: string;
      contact?: string;
    };
  };
  rentStatus?: string;
  moveInDate?: string;
  isManagerConfirmed?: boolean; // ✅ Flag for property manager confirmation
};

// ---------------- Props ----------------
interface TenantDashboardProps {
  tenant: Tenant;
}

// ---------------- Constants ----------------
const categories = ["Plumbing", "Electrical", "Internet", "Painting"];
const locations = ["Kitchen", "Bathroom", "Living Room", "Bedroom", "Corridor"];
const priorities = ["High", "Medium", "Low"] as const;
const statuses = ["Pending", "Assigned", "In Progress", "Resolved"] as const;

const TUNYCE_MAROON = "#58181C";
const TUNYCE_RED = "#C81E1E";
const TUNYCE_YELLOW = "#F4C542";

// ---------------- Component ----------------
export default function TenantDashboard({ tenant }: TenantDashboardProps) {
  // ---------- Role Confirmation ----------
  const [isTenant, setIsTenant] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [managerConfirmed, _setManagerConfirmed] = useState<boolean>(tenant.isManagerConfirmed || false);

  // ---------- Fault State ----------
  const [faults, setFaults] = useState<Fault[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState(locations[0]);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<typeof priorities[number]>("Medium");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalMediaIndex, _setModalMediaIndex] = useState<{ urls: string[]; current: number } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toasts, setToasts] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [carouselIndex, _setCarouselIndex] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---------- Media Previews ----------
  useEffect(() => {
    const previews = mediaFiles.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [mediaFiles]);

  // ---------- Scroll Messages ----------
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [faults]);

  // ---------- Functions ----------
  const showToast = (message: string) => {
    setToasts(prev => [message, ...prev]);
    setTimeout(() => setToasts(prev => prev.filter(m => m !== message)), 3000);
  };

  const resetForm = () => {
    setTitle(""); setCategory(categories[0]); setLocation(locations[0]);
    setDescription(""); setPriority("Medium"); setMediaFiles([]); setMediaPreviews([]);
  };

  const submitFault = () => {
    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }

    const newFault: Fault = {
      id: `f_${Date.now()}`,
      title,
      category,
      location,
      description,
      status: "Pending",
      priority: title.toLowerCase().includes("leak") ? "High" : priority,
      dateReported: new Date().toISOString(),
      tenantId: tenant.id,
      propertyId: tenant.property!.id,
      landlordId: tenant.property!.landlord.id,
      agencyId: tenant.property!.agency?.id,
      messages: [
        { sender: "Tenant", content: "Reported issue", timestamp: new Date().toISOString() },
        { sender: "System", content: "Your fault has been received.", timestamp: new Date().toISOString() }
      ],
      mediaUrls: [...mediaPreviews],
      estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };

    setFaults([newFault, ...faults]);
    showToast(`Fault #${newFault.id} reported successfully`);
    resetForm();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _sendReply = (faultId: string) => {
    if (!replyText) return;
    const newMessage: FaultMessage = { sender: "Tenant", content: replyText, timestamp: new Date().toISOString() };
    setFaults(prev => prev.map(f => f.id === faultId ? { ...f, messages: [...(f.messages || []), newMessage] } : f));
    setReplyText("");
    setTimeout(() => {
      const landlordReply: FaultMessage = { sender: "Landlord", content: "We'll look into it shortly.", timestamp: new Date().toISOString() };
      setFaults(prev => prev.map(f => f.id === faultId ? { ...f, messages: [...(f.messages || []), landlordReply] } : f));
    }, 1500);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _formatDate = (iso: string) => new Date(iso).toLocaleString();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _filteredFaults = faults.filter(f => {
    const statusMatch = filterStatus === "All" || f.status === filterStatus;
    const categoryMatch = filterCategory === "All" || f.category === filterCategory;
    const priorityMatch = filterPriority === "All" || f.priority === filterPriority;
    const searchMatch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && priorityMatch && searchMatch;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _nextMedia = (faultId: string, length: number) => {
    _setCarouselIndex(prev => ({ ...prev, [faultId]: prev[faultId] === undefined ? 0 : (prev[faultId] + 1) % length }));
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _prevMedia = (faultId: string, length: number) => {
    _setCarouselIndex(prev => ({ ...prev, [faultId]: prev[faultId] === undefined ? length - 1 : (prev[faultId] - 1 + length) % length }));
  };

  const totalResolved = faults.filter(f => f.status === "Resolved").length;
  const totalHigh = faults.filter(f => f.priority === "High").length;
  const totalMedium = faults.filter(f => f.priority === "Medium").length;
  const totalLow = faults.filter(f => f.priority === "Low").length;

  // ---------------- Render ----------------

  // ---------- Step 1: Tenant self-confirm ----------
  if (isTenant === null) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-black p-6">
        <h2 className="text-2xl font-bold mb-4">Are you a tenant?</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsTenant(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Yes
          </button>
          <button
            onClick={() => setIsTenant(false)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 2: Not a tenant ----------
  if (!isTenant) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-black p-6">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You must be a tenant to access this dashboard.</p>
      </div>
    );
  }

  // ---------- Step 3: Waiting for manager confirmation ----------
  if (!managerConfirmed) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-black p-6">
        <h2 className="text-xl font-bold mb-2">Waiting for Property Manager Confirmation</h2>
        <p>Your property manager must approve your account before you can access the dashboard.</p>
        <p className="mt-4 text-gray-500">Once approved, you can log in again to access your dashboard.</p>
      </div>
    );
  }

  // ---------- Step 4: Tenant confirmed by manager ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Maintenance Dashboard</h1>

      {/* Toasts */}
      <div className="fixed top-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t, i) => <div key={i} className="bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">{t}</div>)}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-xl p-4 text-center">Total Faults <p className="text-2xl font-bold">{faults.length}</p></div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">Resolved <p className="text-2xl font-bold">{totalResolved}</p></div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">Pending <p className="text-2xl font-bold">{faults.length - totalResolved}</p></div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">High <p className="text-2xl font-bold">{totalHigh}</p></div>
        <div className="bg-white shadow-md rounded-xl p-4 text-center">Medium/Low <p className="text-2xl font-bold">{totalMedium + totalLow}</p></div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input type="text" placeholder="Search faults..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"/>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">
          <option value="All">All Status</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">
          <option value="All">All Priorities</option>
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Fault Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Report a Fault</h2>
        <div className="flex flex-col gap-4">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"/>
          <div className="flex gap-4 flex-wrap">
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">{categories.map(c => <option key={c}>{c}</option>)}</select>
            <select value={location} onChange={e => setLocation(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">{locations.map(l => <option key={l}>{l}</option>)}</select>
            <select value={priority} onChange={e => setPriority(e.target.value as typeof priorities[number])} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black">{priorities.map(p => <option key={p}>{p} Priority</option>)}</select>
          </div>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"/>
          <div className="flex items-center gap-4">
            <button onClick={() => fileInputRef.current?.click()} className={`px-4 py-2 rounded-lg transition text-black bg-[${TUNYCE_YELLOW}] hover:bg-yellow-300`}>{mediaFiles.length ? "Change Media" : "Attach Media"}</button>
            <input type="file" ref={fileInputRef} multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && setMediaFiles(Array.from(e.target.files))}/>
          </div>
          {mediaPreviews.length > 0 && <div className="flex gap-2 overflow-x-auto">{mediaPreviews.map((url, idx) => <Image key={idx} src={url} alt="Preview" width={128} height={128} onClick={() => _setModalMediaIndex({ urls: mediaPreviews, current: idx })} className="w-32 h-32 object-cover rounded-lg cursor-pointer"/>)} </div>}
          <button onClick={submitFault} className={`px-6 py-3 rounded-full bg-[${TUNYCE_MAROON}] text-white font-semibold hover:bg-[${TUNYCE_RED}] transition`}>Submit Fault</button>
        </div>
      </div>

      {/* The rest of fault list, carousel, messages, modal can remain the same */}
    </div>
  );
}
