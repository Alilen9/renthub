"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// Dummy data
const taskStats = [
  { month: "Jan", assigned: 10, completed: 8 },
  { month: "Feb", assigned: 12, completed: 10 },
  { month: "Mar", assigned: 8, completed: 6 },
  { month: "Apr", assigned: 15, completed: 12 },
  { month: "May", assigned: 20, completed: 18 },
];

const ratings = [
  { property: "Property 1", rating: 4.5 },
  { property: "Property 2", rating: 4.7 },
  { property: "Property 3", rating: 4.2 },
  { property: "Property 4", rating: 4.8 },
];

const recentActivity = [
  { type: "Task Assigned", detail: "New task for Property 1", time: "2h ago" },
  { type: "Message", detail: "Landlord reached out", time: "4h ago" },
  { type: "Task Completed", detail: "Task for Property 2", time: "1d ago" },
];

export default function SPNDashboard() {
  const [tasksAssigned] = useState(65);
  const [tasksCompleted] = useState(50);
  const [messages, setMessages] = useState([
    { sender: "Landlord", content: "Please fix the AC asap." },
    { sender: "SPN", content: "Sure, I'll handle it today." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const avgRating =
    ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "SPN", content: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SPNSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto text-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-black">{new Date().toLocaleDateString()}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center transition border border-gray-100">
            <p className="text-black">Tasks Assigned</p>
            <h2 className="text-2xl font-bold text-indigo-600">{tasksAssigned}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center transition border border-gray-100">
            <p className="text-black">Tasks Completed</p>
            <h2 className="text-2xl font-bold text-green-600">{tasksCompleted}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center transition border border-gray-100">
            <p className="text-black">Average Rating</p>
            <h2 className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)} ⭐</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center transition border border-gray-100">
            <p className="text-black">New Messages</p>
            <h2 className="text-2xl font-bold text-red-600">{messages.filter(m => m.sender === "Landlord").length}</h2>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Completion Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">Task Completion Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskStats}>
                <XAxis dataKey="month" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" fill="#4f46e5" />
                <Bar dataKey="completed" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ratings Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">Property Ratings</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ratings}>
                <XAxis dataKey="property" stroke="#000" />
                <YAxis domain={[0, 5]} stroke="#000" />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="rating" stroke="#F4C542" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-black">Recent Activity</h2>
            <ul className="space-y-3">
              {recentActivity.map((item, idx) => (
                <li key={idx} className="flex justify-between bg-gray-100 p-3 rounded">
                  <div>
                    <p className="font-medium text-black">{item.type}</p>
                    <p className="text-black text-sm">{item.detail}</p>
                  </div>
                  <p className="text-black text-sm">{item.time}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat */}
          <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 text-black">Chat with Landlord</h2>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2 border border-gray-300 p-3 rounded bg-white">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-[80%] ${
                    msg.sender === "SPN"
                      ? "bg-indigo-200 self-end text-black"
                      : "bg-green-200 self-start text-black"
                  }`}
                >
                  <span className="font-medium">{msg.sender}:</span> {msg.content}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-400 p-2 rounded bg-gray-100 text-black focus:outline-none focus:border-indigo-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
