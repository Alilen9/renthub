"use client";

import { useState, useRef, useEffect } from "react";
import SPNSidebar from "@/components/spn/SPNSidebar";

type Message = { sender: "SPN" | "Landlord"; content: string };

export default function SPNMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "Landlord", content: "Are you available this Friday?" },
    { sender: "SPN", content: "Yes, I have a 2pm slot open." },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const msgEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { sender: "SPN", content: newMsg }]);
    setNewMsg("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <SPNSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Messages</h1>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] p-3 rounded-lg text-black ${
                    m.sender === "SPN" ? "ml-auto bg-indigo-100" : "bg-green-100"
                  }`}
                >
                  <strong className="text-black">{m.sender}:</strong>{" "}
                  <span className="text-black">{m.content}</span>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 text-black bg-white"
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
      </main>
    </div>
  );
}
