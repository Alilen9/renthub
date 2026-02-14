"use client";

import React, { useEffect, useState } from "react";
import TenantSidebar from "@/components/tenants/TenantSidebar";
import { 
  FiCheckCircle, FiClock, FiStar, FiMessageCircle, 
  FiPlay, FiTrash2, FiChevronDown, FiChevronUp 
} from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ---------------- Types ----------------
type LogEntry = { action: string; type: string; timestamp: string; demo?: boolean; };
type RatingEntry = { rating: number; feedback: string; timestamp: string; demo?: boolean; };
type MessageEntry = { sender: "Tenant" | "Landlord"; message: string; timestamp: string; demo?: boolean; };

type PolicyKeys = "transparency" | "logs" | "ratings" | "mediation";

export default function FairnessPolicyFullPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newFeedback, setNewFeedback] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [showPolicy, setShowPolicy] = useState<Record<PolicyKeys, boolean>>({
    transparency: true,
    logs: true,
    ratings: true,
    mediation: true,
  });
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem("logs") || "[]"));
    setRatings(JSON.parse(localStorage.getItem("ratings") || "[]"));
    setMessages(JSON.parse(localStorage.getItem("mediation") || "[]"));
  }, []);

  const saveLogs = (entry: LogEntry) => {
    const updated = [...logs, entry];
    setLogs(updated);
    localStorage.setItem("logs", JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const submitRating = () => {
    if (!newFeedback) return;
    const entry: RatingEntry = { rating: newRating, feedback: newFeedback, timestamp: new Date().toLocaleString() };
    const updated = [...ratings, entry];
    setRatings(updated);
    localStorage.setItem("ratings", JSON.stringify(updated));
    setNewFeedback("");
    saveLogs({ action: `Rating submitted: ${newRating} stars`, type: "Rating", timestamp: entry.timestamp });
    showToast("Rating submitted!");
  };

  const sendMessage = () => {
    if (!newMessage) return;
    const entry: MessageEntry = { sender: "Tenant", message: newMessage, timestamp: new Date().toLocaleString() };
    const updated = [...messages, entry];
    setMessages(updated);
    localStorage.setItem("mediation", JSON.stringify(updated));
    setNewMessage("");
    saveLogs({ action: "Mediation message sent", type: "Message", timestamp: entry.timestamp });
    showToast("Message sent!");
  };

  const addSampleData = () => {
    const sampleLogs: LogEntry[] = [
      { action: "Report submitted: Broken door", type: "Maintenance", timestamp: new Date().toLocaleString(), demo: true },
      { action: "Payment completed: October rent", type: "Payment", timestamp: new Date().toLocaleString(), demo: true },
      { action: "Maintenance resolved: Plumbing issue", type: "Maintenance", timestamp: new Date().toLocaleString(), demo: true },
    ];
    const sampleRatings: RatingEntry[] = [
      { rating: 5, feedback: "Landlord responded quickly", timestamp: new Date().toLocaleString(), demo: true },
      { rating: 4, feedback: "Maintenance team was professional", timestamp: new Date().toLocaleString(), demo: true },
    ];
    const sampleMessages: MessageEntry[] = [
      { sender: "Tenant", message: "The water heater is not working", timestamp: new Date().toLocaleString(), demo: true },
      { sender: "Landlord", message: "We will send someone tomorrow", timestamp: new Date().toLocaleString(), demo: true },
    ];
    localStorage.setItem("logs", JSON.stringify(sampleLogs));
    localStorage.setItem("ratings", JSON.stringify(sampleRatings));
    localStorage.setItem("mediation", JSON.stringify(sampleMessages));
    setLogs(sampleLogs);
    setRatings(sampleRatings);
    setMessages(sampleMessages);
    showToast("Demo data loaded!");
  };

  const clearDemoData = () => {
    const filteredLogs = logs.filter((l) => !l.demo);
    const filteredRatings = ratings.filter((r) => !r.demo);
    const filteredMessages = messages.filter((m) => !m.demo);
    setLogs(filteredLogs);
    setRatings(filteredRatings);
    setMessages(filteredMessages);
    localStorage.setItem("logs", JSON.stringify(filteredLogs));
    localStorage.setItem("ratings", JSON.stringify(filteredRatings));
    localStorage.setItem("mediation", JSON.stringify(filteredMessages));
    showToast("Demo data cleared!");
  };

  // Example chart data for analytics
  const chartData = [
    { name: "Week 1", Reports: logs.filter(l => l.type === "Maintenance").length, Payments: logs.filter(l => l.type === "Payment").length },
    { name: "Week 2", Reports: 2, Payments: 1 },
    { name: "Week 3", Reports: 1, Payments: 2 },
    { name: "Week 4", Reports: 3, Payments: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative">

      <div className="flex-1 p-8 space-y-6">
        {/* Toast */}
        {toast && <div className="fixed top-4 right-4 bg-[#C81E1E] text-white px-4 py-2 rounded shadow-lg">{toast}</div>}

        {/* Policy Section */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
          <h1 className="text-3xl font-bold text-[#58181C] flex items-center gap-3">
            <FiCheckCircle className="text-[#C81E1E]" size={32} /> Fairness & Transparency Policy
          </h1>

          {[
            { key: "transparency", title: "Transparency", content: "All interactions are logged and visible to both landlord and tenant, including reports, payments, maintenance updates, and communication." },
            { key: "logs", title: "Interaction Logs", content: "Every action is time-stamped and cannot be altered. Includes report submissions, status updates, payments, maintenance actions, messages exchanged." },
            { key: "ratings", title: "Rating & Feedback", content: "Both parties can rate the experience after resolving an issue to promote accountability and service quality." },
            { key: "mediation", title: "Mediation & Disputes", content: "RentHub provides a digital mediation tool with full logs available for arbitration or legal reference." },
          ].map((section) => {
            const k = section.key as PolicyKeys;
            return (
              <div key={section.key} className="border-t border-gray-200 pt-2">
                <button
                  className="flex justify-between w-full font-semibold text-[#58181C] hover:text-[#C81E1E] focus:outline-none"
                  onClick={() => setShowPolicy({ ...showPolicy, [k]: !showPolicy[k] })}
                >
                  {section.title}
                  {showPolicy[k] ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showPolicy[k] && <p className="text-gray-700 mt-2">{section.content}</p>}
              </div>
            );
          })}

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={addSampleData} className="inline-flex items-center gap-2 bg-[#C81E1E] text-white px-4 py-2 rounded-lg hover:bg-[#58181C] transition"><FiPlay /> Preview Sample Data</button>
            <button onClick={clearDemoData} className="inline-flex items-center gap-2 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"><FiTrash2 /> Clear Demo Data</button>
          </div>
          <p className="mt-2 text-sm text-gray-500 italic">Demo entries are for preview only and won’t affect real records.</p>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#58181C] mb-4">Analytics (Demo)</h2>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Reports" stroke="#C81E1E" strokeWidth={2} />
                <Line type="monotone" dataKey="Payments" stroke="#58181C" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interaction Logs */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#58181C] mb-4 flex items-center gap-2"><FiClock className="text-[#C81E1E]" /> Interaction Logs</h2>
          {logs.length === 0 ? <p className="text-gray-600">No interactions logged yet.</p> : (
            <ul className="list-disc ml-6 text-gray-700">
              {logs.map((log, idx) => (
                <li key={idx} className={log.demo ? "bg-yellow-50 p-1 rounded-md inline-block" : ""}>
                  {log.action} — <span className="text-gray-400">{log.timestamp}</span> {log.demo && <span className="ml-2 text-yellow-600 italic">(Demo)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ratings */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#58181C] mb-4 flex items-center gap-2"><FiStar className="text-[#C81E1E]" /> Ratings & Feedback</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input type="number" min={1} max={5} value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} className="border p-2 rounded-lg w-24 text-black" />
            <input type="text" placeholder="Feedback..." value={newFeedback} onChange={(e) => setNewFeedback(e.target.value)} className="border p-2 rounded-lg flex-1 text-black" />
            <button onClick={submitRating} className="bg-[#C81E1E] text-white px-4 rounded-lg hover:bg-[#58181C] transition">Submit</button>
          </div>
          <ul className="space-y-2 text-gray-700">
            {ratings.map((r, idx) => (
              <li key={idx} className={r.demo ? "bg-yellow-50 p-1 rounded-md" : ""}>
                {Array.from({ length: r.rating }).map((_, i) => (<FiStar key={i} className="inline text-yellow-400" />))} — {r.feedback} <span className="text-gray-400">({r.timestamp})</span> {r.demo && <span className="ml-2 text-yellow-600 italic">(Demo)</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Mediation */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#58181C] mb-4 flex items-center gap-2"><FiMessageCircle className="text-[#C81E1E]" /> Mediation / Disputes</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="border p-2 rounded-lg flex-1 text-black" />
            <button onClick={sendMessage} className="bg-[#C81E1E] text-white px-4 rounded-lg hover:bg-[#58181C] transition">Send</button>
          </div>
          <ul className="space-y-2 text-gray-700 max-h-64 overflow-y-auto">
            {messages.map((msg, idx) => (
              <li key={idx} className={msg.demo ? "bg-yellow-50 p-1 rounded-md" : "p-2 bg-gray-100 rounded-lg"}>
                <span className="font-semibold">{msg.sender}:</span> {msg.message} <span className="text-gray-400 text-sm">({msg.timestamp})</span> {msg.demo && <span className="ml-2 text-yellow-600 italic">(Demo)</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
