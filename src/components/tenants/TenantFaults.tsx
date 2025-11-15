"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, ChevronLeft, ChevronRight } from "lucide-react";

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
  estimatedArrival?: string;
  serviceProvider?: { name: string; contact?: string };
  mediaUrls?: string[];
  messages?: FaultMessage[];
  rating?: number;
  feedback?: string;
};

type Tenant = {
  name: string;
  email: string;
  phone: string;
  houseNumber: string;
  propertyType: string;
  propertyArea: string;
  rentStatus: string;
  moveInDate: string;
};

interface TenantDashboardProps {
  tenant: Tenant;
}

const categories = ["Plumbing", "Electrical", "Internet", "Painting"];
const locations = ["Kitchen", "Bathroom", "Living Room", "Bedroom", "Corridor"];
const priorities = ["High", "Medium", "Low"] as const;
const statuses = ["Pending", "Assigned", "In Progress", "Resolved"] as const;

const TUNYCE_MAROON = "#58181C";
const TUNYCE_RED = "#C81E1E";
const TUNYCE_YELLOW = "#F4C542";

export default function TenantDashboard({ tenant }: TenantDashboardProps) {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [location, setLocation] = useState(locations[0]);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<typeof priorities[number]>("Medium");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [modalMediaIndex, setModalMediaIndex] = useState<{ urls: string[]; current: number } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toasts, setToasts] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Media previews
  useEffect(() => {
    const previews = mediaFiles.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [mediaFiles]);

  // Scroll messages to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [faults]);

  // Submit a fault
  const submitFault = () => {
    if (!title || !category || !description) {
      alert("Please fill all fields");
      return;
    }
    const autoPriority = title.toLowerCase().includes("leak") ? "High" : priority;
    const newFault: Fault = {
      id: `f_${Date.now()}`,
      title,
      category,
      location,
      description,
      status: "Pending",
      priority: autoPriority,
      dateReported: new Date().toISOString(),
      messages: [
        { sender: "Tenant", content: "Reported issue", timestamp: new Date().toISOString() },
        { sender: "System", content: "Your fault has been received.", timestamp: new Date().toISOString() }
      ],
      mediaUrls: [...mediaPreviews],
      estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };
    setFaults([newFault, ...faults]);
    showToast(`Fault #${newFault.id} reported successfully`);
    setTitle(""); setCategory(categories[0]); setLocation(locations[0]);
    setDescription(""); setPriority("Medium"); setMediaFiles([]); setMediaPreviews([]);
  };

  const showToast = (message: string) => {
    setToasts(prev => [message, ...prev]);
    setTimeout(() => setToasts(prev => prev.filter(m => m !== message)), 3000);
  };

  const sendReply = (faultId: string) => {
    if (!replyText) return;
    const newMessage: FaultMessage = { sender: "Tenant", content: replyText, timestamp: new Date().toISOString() };
    setFaults(prev => prev.map(f => f.id === faultId ? { ...f, messages: [...(f.messages || []), newMessage] } : f));
    setReplyText("");
    setTimeout(() => {
      const landlordReply: FaultMessage = { sender: "Landlord", content: "We'll look into it shortly.", timestamp: new Date().toISOString() };
      setFaults(prev => prev.map(f => f.id === faultId ? { ...f, messages: [...(f.messages || []), landlordReply] } : f));
    }, 1500);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const filteredFaults = faults.filter(f => {
    const statusMatch = filterStatus === "All" || f.status === filterStatus;
    const categoryMatch = filterCategory === "All" || f.category === filterCategory;
    const priorityMatch = filterPriority === "All" || f.priority === filterPriority;
    const searchMatch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && categoryMatch && priorityMatch && searchMatch;
  });

  const nextMedia = (faultId: string, length: number) => {
    setCarouselIndex(prev => ({ ...prev, [faultId]: prev[faultId] === undefined ? 0 : (prev[faultId] + 1) % length }));
  };
  const prevMedia = (faultId: string, length: number) => {
    setCarouselIndex(prev => ({ ...prev, [faultId]: prev[faultId] === undefined ? length - 1 : (prev[faultId] - 1 + length) % length }));
  };

  const totalResolved = faults.filter(f => f.status === "Resolved").length;
  const totalHigh = faults.filter(f => f.priority === "High").length;
  const totalMedium = faults.filter(f => f.priority === "Medium").length;
  const totalLow = faults.filter(f => f.priority === "Low").length;

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

      {/* Search and Filters */}
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
          {mediaPreviews.length > 0 && <div className="flex gap-2 overflow-x-auto">{mediaPreviews.map((url, idx) => <img key={idx} src={url} onClick={() => setModalMediaIndex({ urls: mediaPreviews, current: idx })} className="w-32 h-32 object-cover rounded-lg cursor-pointer"/>)} </div>}
          <button onClick={submitFault} className={`px-6 py-3 rounded-full bg-[${TUNYCE_MAROON}] text-white font-semibold hover:bg-[${TUNYCE_RED}] transition`}>Submit Fault</button>
        </div>
      </div>

      {/* Fault List */}
      <div className="grid gap-6">
        {filteredFaults.map(f => (
          <div key={f.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-black">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${f.priority === "High" ? "bg-red-100 text-red-800" : f.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{f.priority} Priority</span>
            </div>

            {/* Timeline with ETA */}
            <div className="flex items-center justify-between mt-4 mb-2">
              {statuses.map((s, idx) => {
                const active = statuses.indexOf(f.status) >= idx;
                return (
                  <div key={s} className="flex-1 flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? "bg-black border-black text-white" : "bg-white border-gray-300"}`}>{idx + 1}</div>
                    {idx < statuses.length - 1 && <div className={`flex-1 h-1 ${active ? "bg-black" : "bg-gray-300"} transition-all`}/>}
                  </div>
                );
              })}
            </div>
            {f.estimatedArrival && <p className="text-sm text-gray-600 mb-2">Estimated Arrival: {new Date(f.estimatedArrival).toLocaleTimeString()}</p>}
            {f.serviceProvider && <p className="text-sm text-gray-600 mb-2">Provider: {f.serviceProvider.name}{f.serviceProvider.contact && ` (${f.serviceProvider.contact})`}</p>}

            <p className="text-gray-800 mt-2">{f.description}</p>
            <p className="text-gray-600 text-sm mt-1">Category: {f.category} | Location: {f.location}</p>

            {/* Media Carousel */}
            {f.mediaUrls && f.mediaUrls.length > 0 && <div className="relative mt-4 w-full max-w-md mx-auto">
              <img src={f.mediaUrls[carouselIndex[f.id] ?? 0]} alt="media" className="w-full h-64 object-cover rounded-lg cursor-pointer" onClick={() => setModalMediaIndex({ urls: f.mediaUrls!, current: carouselIndex[f.id] ?? 0 })}/>
              {f.mediaUrls.length > 1 && <>
                <button onClick={() => prevMedia(f.id, f.mediaUrls!.length)} className="absolute top-1/2 left-2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"><ChevronLeft size={20}/></button>
                <button onClick={() => nextMedia(f.id, f.mediaUrls!.length)} className="absolute top-1/2 right-2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"><ChevronRight size={20}/></button>
              </>}
            </div>}

            {/* Messages */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto space-y-2 text-black">
              {(f.messages || []).map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === "Tenant" ? "items-end" : "items-start"}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === "Tenant" ? "bg-black text-white" : msg.sender === "System" ? "bg-gray-200 text-black italic" : "bg-gray-300 text-black"}`}>{msg.content}</div>
                  <span className="text-xs text-gray-500 mt-0.5">{formatDate(msg.timestamp)}</span>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Reply */}
            <div className="flex gap-2 mt-3">
              <input type="text" placeholder="Reply..." value={replyText} onChange={e => setReplyText(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"/>
              <button onClick={() => sendReply(f.id)} className="px-3 py-2 bg-[${TUNYCE_MAROON}] text-white rounded-lg hover:bg-[${TUNYCE_RED}] transition"><Send size={18}/></button>
            </div>

            {/* Rating */}
            {f.status === "Resolved" && !f.rating && <div className="flex gap-1 mt-3">
              {[1,2,3,4,5].map(i => <button key={i} onClick={() => setFaults(prev => prev.map(ff => ff.id === f.id ? { ...ff, rating: i, feedback: "Good" } : ff))} className="text-yellow-400 text-2xl">★</button>)}
            </div>}
            {f.rating && <p className="mt-2 text-sm text-gray-700">Rating: {f.rating} ★ | Feedback: {f.feedback}</p>}
          </div>
        ))}
      </div>

      {/* Modal for full carousel */}
      {modalMediaIndex && <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <button onClick={() => setModalMediaIndex(null)} className="absolute top-6 right-6 text-white"><X size={30}/></button>
        <button onClick={() => setModalMediaIndex(mi => ({ urls: mi!.urls, current: (mi!.current -1 + mi!.urls.length) % mi!.urls.length }))} className="absolute left-4 text-white text-3xl"><ChevronLeft size={40}/></button>
        <img src={modalMediaIndex.urls[modalMediaIndex.current]} alt="media" className="max-h-[90%] max-w-[90%] rounded-lg"/>
        <button onClick={() => setModalMediaIndex(mi => ({ urls: mi!.urls, current: (mi!.current +1) % mi!.urls.length }))} className="absolute right-4 text-white text-3xl"><ChevronRight size={40}/></button>
      </div>}
    </div>
  );
}
