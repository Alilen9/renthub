"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Inquiry {
  id: string;
  name: string;
  message: string;
  property: string;
  time: string;
  read: boolean;
  chat?: { sender: string; text: string; time: string }[];
}

export default function TenantInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [replyText, setReplyText] = useState("");
  const [activeChat, setActiveChat] = useState<Inquiry | null>(null);
  const router = useRouter();

  // Load from localStorage or initialize
  useEffect(() => {
    const saved = localStorage.getItem("tenant_inquiries");
    if (saved) {
      setInquiries(JSON.parse(saved));
    } else {
      const defaults: Inquiry[] = [
        {
          id: "inq_1",
          name: "Jane Mwangi",
          message: "Is this still available?",
          property: "2BR Apartment, Ruiru",
          time: "2h ago",
          read: false,
          chat: [
            { sender: "Jane Mwangi", text: "Is this still available?", time: "2h ago" },
          ],
        },
        {
          id: "inq_2",
          name: "Brian Otieno",
          message: "Can I schedule a viewing?",
          property: "1BR Studio, Juja",
          time: "1d ago",
          read: true,
          chat: [
            { sender: "Brian Otieno", text: "Can I schedule a viewing?", time: "1d ago" },
            { sender: "You", text: "Sure, tomorrow at 3PM works fine.", time: "22h ago" },
          ],
        },
      ];
      setInquiries(defaults);
      localStorage.setItem("tenant_inquiries", JSON.stringify(defaults));
    }
  }, []);

  // Handle sending a reply
  const sendReply = (tenantId: string) => {
    if (!replyText.trim()) return;
    const updated = inquiries.map((inq) =>
      inq.id === tenantId
        ? {
            ...inq,
            read: true,
            chat: [...(inq.chat || []), { sender: "You", text: replyText, time: "Just now" }],
          }
        : inq
    );
    setInquiries(updated);
    localStorage.setItem("tenant_inquiries", JSON.stringify(updated));
    setReplyText("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">💬 Tenant Inquiries</h2>
        <span className="text-sm text-gray-500">{inquiries.length} total</span>
      </div>

      <div className="space-y-4 max-h-64 overflow-auto">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="border-b last:border-none pb-3 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {inq.name}{" "}
                <span className="text-xs text-gray-400">· {inq.property}</span>
              </p>
              <p className="text-sm text-gray-600">{inq.message}</p>
              <p className="text-xs text-gray-400 mt-1">{inq.time}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => setActiveChat(inq)}
                className="px-3 py-1 text-xs rounded bg-[#C81E1E] text-white hover:bg-[#58181C] transition-all"
              >
                Reply
              </button>
              <button
                onClick={() => router.push(`/landlord/chats/${inq.id}`)}
                className="px-3 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                View Full Chat
              </button>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tenant inquiries yet.</p>
        )}
      </div>

      {/* ✅ Chat modal */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Chat with {activeChat.name}
              </h3>
              <button
                onClick={() => setActiveChat(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="border rounded-lg p-3 h-56 overflow-y-auto bg-gray-50 mb-3">
              {activeChat.chat?.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.sender === "You" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`inline-block px-3 py-1 rounded-lg ${
                      msg.sender === "You"
                        ? "bg-red-100 text-gray-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              />
              <button
                onClick={() => sendReply(activeChat.id)}
                className="px-4 py-2 bg-[#C81E1E] text-white rounded-lg hover:bg-[#58181C] transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
