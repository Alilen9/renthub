"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";

export default function ChatPage() {
  const { tenantId } = useParams();
  const [chat, setChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tenant_inquiries");
    if (saved) {
      const list = JSON.parse(saved);
      const tenant = list.find((q: any) => q.id === tenantId);
      if (tenant) setChat(tenant);
    }
  }, [tenantId]);

  // Scroll to bottom whenever chat updates
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: "Landlord",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toDateString(),
    };

    const updatedChat = {
      ...chat,
      chat: [...(chat.chat || []), newMsg],
    };

    setChat(updatedChat);
    localStorage.setItem("tenant_inquiries", JSON.stringify(updateStorage(updatedChat)));
    setMessage("");

    // Simulate typing + auto-reply
    setIsTyping(true);
    setTimeout(() => {
      const autoReply = {
        sender: chat.name,
        text: getAutoReply(message),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toDateString(),
      };
      const updated = {
        ...updatedChat,
        chat: [...updatedChat.chat, autoReply],
      };
      setChat(updated);
      localStorage.setItem("tenant_inquiries", JSON.stringify(updateStorage(updated)));
      setIsTyping(false);
    }, 1800);
  };

  const updateStorage = (updatedChat: any) => {
    const saved = localStorage.getItem("tenant_inquiries");
    if (!saved) return [updatedChat];
    const list = JSON.parse(saved);
    return list.map((t: any) => (t.id === updatedChat.id ? updatedChat : t));
  };

  const getAutoReply = (msg: string) => {
    msg = msg.toLowerCase();
    if (msg.includes("rent")) return "Okay, I’ll send the rent details shortly.";
    if (msg.includes("issue") || msg.includes("problem"))
      return "Thanks for letting me know. I’ll have someone look into it.";
    if (msg.includes("thanks") || msg.includes("thank"))
      return "You're most welcome!";
    if (msg.includes("hello") || msg.includes("hi"))
      return "Hi there! How can I assist you today?";
    return "Alright, noted.";
  };

  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};
    messages.forEach((msg) => {
      if (!groups[msg.date]) groups[msg.date] = [];
      groups[msg.date].push(msg);
    });
    return groups;
  };

  if (!chat)
    return (
      <div className="text-center text-gray-500 p-8">
        Loading conversation...
      </div>
    );

  const grouped = groupMessagesByDate(chat.chat || []);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl flex flex-col h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-100">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-semibold text-red-700">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{chat.name}</h2>
          <p className="text-xs text-green-600">
            {isTyping ? "Typing..." : "Online"}
          </p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {Object.keys(grouped).map((date, i) => (
          <div key={i}>
            <div className="flex justify-center my-3">
              <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                {date === today ? "Today" : date === yesterday ? "Yesterday" : date}
              </span>
            </div>
            {grouped[date].map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-3 ${
                  msg.sender === "Landlord" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === "Landlord"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-75 block mt-1 text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
