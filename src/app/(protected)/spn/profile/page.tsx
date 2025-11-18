// app/spn/profile/page.tsx
"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState, useRef, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";

const services = [
  { id: 1, title: "Plumbing", price: "From KES 500" },
  { id: 2, title: "Electrical", price: "From KES 700" },
  { id: 3, title: "Painting", price: "From KES 1500" },
  { id: 4, title: "Cleaning", price: "From KES 300" },
];

const reviews = [
  {
    id: 1,
    author: "Alice Mkangoma",
    rating: 5,
    text: "Quick response and fixed the leak within a day. Highly recommend!",
    date: "2025-10-02",
  },
  {
    id: 2,
    author: "John Mwangi",
    rating: 4,
    text: "Good job on the wiring. A bit late but quality was good.",
    date: "2025-09-15",
  },
];

export default function SPNProfilePage() {
  const [messages, setMessages] = useState([
    { sender: "Landlord", content: "Are you available this Friday?" },
    { sender: "SPN", content: "Yes — I have a 2pm slot open." },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const msgEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages((m) => [...m, { sender: "SPN", content: newMsg }]);
    setNewMsg("");
  };

  // profile meta
  const name = "Samuel Njoroge";
  const title = "Service Provider - SPN";
  const rating = 4.8;
  const completedTasks = 124;
  const years = 3;

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <SPNSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">{name}</h1>
              <p className="text-black text-sm mt-1">{title}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow border border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  <span className="font-semibold text-black">{rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-black">• {completedTasks} tasks</div>
              </div>

              <button
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={() =>
                  alert("Chat panel is available on this page — use message box on the right.")
                }
              >
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Profile Card */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-black">
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/default-avatar.png"
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover border mb-4"
                  />
                  <h2 className="text-xl font-semibold text-black">{name}</h2>
                  <p className="text-sm text-black mt-1">{years} years experience</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-black ml-2">{rating.toFixed(1)}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 w-full text-left">
                    <h3 className="text-sm font-medium text-black">Contact</h3>
                    <p className="text-black text-sm mt-2">Phone: +254 712 345 678</p>
                    <p className="text-black text-sm mt-1">Location: Nairobi, Kenya</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 w-full grid grid-cols-2 gap-3 text-black">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-sm">Completed</div>
                      <div className="font-bold text-black">{completedTasks}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-sm">Response</div>
                      <div className="font-bold text-black">2h</div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-6 text-black">
                  <h4 className="text-md font-semibold mb-3">Services</h4>
                  <ul className="space-y-2">
                    {services.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-black font-medium">{s.title}</span>
                        <span className="text-sm text-black">{s.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Middle: About + Reviews */}
            <section className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-black mb-6">
                <h3 className="text-lg font-semibold text-black mb-3">About</h3>
                <p className="text-black text-sm">
                  Experienced service provider specializing in plumbing, electrical repairs, and general maintenance. Reliable, punctual, and committed to quality workmanship.
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-black">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-black bg-gray-100 px-3 py-1 rounded-full text-sm">Plumbing</span>
                    <span className="text-black bg-gray-100 px-3 py-1 rounded-full text-sm">Electrical</span>
                    <span className="text-black bg-gray-100 px-3 py-1 rounded-full text-sm">Painting</span>
                    <span className="text-black bg-gray-100 px-3 py-1 rounded-full text-sm">Cleaning</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-black">
                <h3 className="text-lg font-semibold mb-4 text-black">Reviews</h3>
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-black">{r.author}</div>
                          <div className="text-sm text-black mt-1">{r.date}</div>
                        </div>
                        <div className="flex items-center gap-1 text-black">
                          <span className="font-semibold text-black">{r.rating}</span>
                          <Star size={14} className="text-yellow-500" />
                        </div>
                      </div>
                      <p className="text-black text-sm mt-2">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Right: Chat & Activity */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-black flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black">Chat</h3>
                  <span className="text-sm text-black">Online</span>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-3 rounded-lg text-black ${
                        m.sender === "SPN" ? "bg-indigo-100 ml-auto text-black" : "bg-green-100 text-black"
                      }`}
                    >
                      <div className="text-sm"><strong>{m.sender}:</strong> {m.content}</div>
                    </div>
                  ))}

                  <div ref={msgEndRef} />
                </div>

                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Write a message..."
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black text-black bg-white"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 text-black mt-6">
                <h4 className="text-md font-semibold mb-3 text-black">Task History</h4>
                <ul className="text-sm text-black space-y-2">
                  <li className="flex justify-between"><span>Fix leaking pipe</span><span className="text-gray-600 text-sm">Nov 20</span></li>
                  <li className="flex justify-between"><span>Replace light bulb</span><span className="text-gray-600 text-sm">Nov 18</span></li>
                  <li className="flex justify-between"><span>Paint walls</span><span className="text-gray-600 text-sm">Nov 25</span></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
