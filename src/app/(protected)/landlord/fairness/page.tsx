"use client";

import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiTrash2,
  FiClock,
  FiStar,
  FiDownload,
} from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ---------------- Types ----------------
type PolicyKeys = "transparency" | "logs" | "ratings" | "mediation";
type LogEntry = { action: string; tenant: string; type: string; timestamp: string; demo?: boolean };
type RatingEntry = { rating: number; tenant: string; feedback: string; timestamp: string; demo?: boolean };

export default function FairnessPolicyLandlord() {
  const [showPolicy, setShowPolicy] = useState<Record<PolicyKeys, boolean>>({
    transparency: true,
    logs: true,
    ratings: true,
    mediation: true,
  });
  const [toast, setToast] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);

  // Load demo data from localStorage
  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem("landlordLogs") || "[]"));
    setRatings(JSON.parse(localStorage.getItem("landlordRatings") || "[]"));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const addSampleData = () => {
    const demoLogs: LogEntry[] = [
      { action: "Report submitted: Broken door", tenant: "Alice Mkangoma", type: "Maintenance", timestamp: new Date().toLocaleString(), demo: true },
      { action: "Payment completed: October rent", tenant: "Bob Smith", type: "Payment", timestamp: new Date().toLocaleString(), demo: true },
    ];
    const demoRatings: RatingEntry[] = [
      { rating: 5, tenant: "Alice Mkangoma", feedback: "Tenant paid on time", timestamp: new Date().toLocaleString(), demo: true },
      { rating: 4, tenant: "Bob Smith", feedback: "Tenant reported issues quickly", timestamp: new Date().toLocaleString(), demo: true },
    ];
    setLogs(demoLogs);
    setRatings(demoRatings);
    localStorage.setItem("landlordLogs", JSON.stringify(demoLogs));
    localStorage.setItem("landlordRatings", JSON.stringify(demoRatings));
    showToast("Demo data loaded!");
  };

  const clearDemoData = () => {
    const filteredLogs = logs.filter((l) => !l.demo);
    const filteredRatings = ratings.filter((r) => !r.demo);
    setLogs(filteredLogs);
    setRatings(filteredRatings);
    localStorage.setItem("landlordLogs", JSON.stringify(filteredLogs));
    localStorage.setItem("landlordRatings", JSON.stringify(filteredRatings));
    showToast("Demo data cleared!");
  };

  // Analytics chart data
  const chartData = [
    { name: "Week 1", Maintenance: logs.filter((l) => l.type === "Maintenance").length, Payments: logs.filter((l) => l.type === "Payment").length },
    { name: "Week 2", Maintenance: 2, Payments: 1 },
    { name: "Week 3", Maintenance: 1, Payments: 2 },
    { name: "Week 4", Maintenance: 3, Payments: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-[#C81E1E] text-white px-4 py-2 rounded shadow-lg">{toast}</div>}

      {/* Policy Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
        <h1 className="text-3xl font-bold text-[#58181C] flex items-center gap-3">
          <FiCheckCircle className="text-[#C81E1E]" size={32} /> Fairness & Transparency Policy
        </h1>

        {[
          { key: "transparency", title: "1. Transparent Operations", content: "Landlords can track tenant reports, payments, maintenance updates, and all communication with complete visibility." },
          { key: "logs", title: "2. Interaction Logs", content: "Each action is securely recorded and cannot be edited. This protects both parties in case of disputes." },
          { key: "ratings", title: "3. Rating System", content: "Landlords can rate tenants, and tenants can rate landlords, promoting professionalism and fairness." },
          { key: "mediation", title: "4. Mediation", content: "RentHub offers a mediation tool that provides all logged details as a digital record for arbitration." },
        ].map((section) => (
          <div key={section.key} className="border-t border-gray-200 pt-2">
            <button
              className="flex justify-between w-full font-semibold text-[#58181C] hover:text-[#C81E1E] focus:outline-none"
              onClick={() =>
                setShowPolicy(prev => ({
                  ...prev,
                  [section.key as PolicyKeys]: !prev[section.key as PolicyKeys],
                }))
              }
            >
              {section.title}
              {showPolicy[section.key as PolicyKeys] ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {showPolicy[section.key as PolicyKeys] && <p className="text-gray-700 mt-2">{section.content}</p>}
          </div>
        ))}

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
              <Line type="monotone" dataKey="Maintenance" stroke="#C81E1E" strokeWidth={2} />
              <Line type="monotone" dataKey="Payments" stroke="#58181C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interaction Logs Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#58181C] mb-4 flex items-center gap-2"><FiClock className="text-[#C81E1E]" /> Interaction Logs</h2>
        {logs.length === 0 ? <p className="text-gray-600">No interactions logged yet.</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Tenant</th>
                  <th className="p-2 border">Action</th>
                  <th className="p-2 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className={log.demo ? "bg-yellow-50" : ""}>
                    <td className="p-2 border">{log.timestamp}</td>
                    <td className="p-2 border">{log.tenant}</td>
                    <td className="p-2 border">{log.action}</td>
                    <td className="p-2 border">{log.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ratings Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#58181C] mb-4 flex items-center gap-2"><FiStar className="text-[#C81E1E]" /> Ratings & Feedback</h2>
        {ratings.length === 0 ? <p className="text-gray-600">No ratings submitted yet.</p> : (
          <ul className="space-y-2 text-gray-700">
            {ratings.map((r, idx) => (
              <li key={idx} className={r.demo ? "bg-yellow-50 p-1 rounded-md" : "p-2 bg-gray-100 rounded-lg"}>
                {Array.from({ length: r.rating }).map((_, i) => (<FiStar key={i} className="inline text-yellow-400" />))} — {r.feedback} <span className="text-gray-400">({r.tenant} | {r.timestamp})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optional: Download Policy */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex justify-end">
        <button className="inline-flex items-center gap-2 bg-[#C81E1E] text-white px-4 py-2 rounded-lg hover:bg-[#58181C] transition">
          <FiDownload /> Download Policy PDF
        </button>
      </div>
    </div>
  );
}
