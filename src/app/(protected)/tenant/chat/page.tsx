"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiCalendar } from "react-icons/fi";
import TenantSidebar from "@/components/tenants/TenantSidebar";

// --- Mock Chat Data ---
const initialChatData = [
  {
    id: 1,
    name: "PATRIC-LANDLORD",
    lastMessage: "Understood. I'll get back to you ...",
    unread: true,
    profileInitials: "MT",
    chatDetails: {
      title: "Landlord",
      location: "Unit 4B - Riverwalk Lofts",
      messages: [
        {
          id: 101,
          sender: "other",
          content: "Hello! We received your inquiry. How can we help you today?",
          time: "9:50 AM",
        },
        {
          id: 102,
          sender: "other",
          content: "Understood. I'll get back to you with an official reply shortly.",
          time: "10:06 AM",
        },
      ],
    },
  },
];

// --- Chat Components ---
function ChatPanelHeader({ title, location }: { title: string; location: string }) {
  const router = useRouter();
  return (
    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-[#58181C]">{title}</h2>
        <p className="text-sm text-gray-600 flex items-center mt-1">
          <span className="inline-block w-2 h-2 bg-[#F4C542] rounded-full mr-2"></span>
          {location}
        </p>
      </div>

      <button
        onClick={() =>
          router.push(`/tenant/booking-system?listing=${encodeURIComponent(location)}`)
        }
        className="px-5 py-2 bg-[#C81E1E] text-white text-sm font-medium rounded-lg hover:bg-[#58181C] transition flex items-center space-x-2 shadow-md"
      >
        <FiCalendar className="w-4 h-4" />
        <span>Book Viewing</span>
      </button>
    </div>
  );
}

function ChatBubble({
  message,
}: {
  message: typeof initialChatData[0]["chatDetails"]["messages"][0];
}) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-sm ${
          isUser
            ? "bg-[#C81E1E] text-white rounded-br-none"
            : "bg-[#f1f1f1] text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        {message.time && (
          <div
            className={`text-xs mt-1 ${
              isUser ? "text-[#F4C542]" : "text-gray-500"
            } text-right`}
          >
            {message.time}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-4">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C81E1E] text-gray-700 bg-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(input)}
      />
      <button
        onClick={() => onSend(input)}
        className="w-12 h-12 flex items-center justify-center bg-[#C81E1E] text-white rounded-full hover:bg-[#58181C] transition shadow-lg"
      >
        <FiMessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}

function ChatWindow({
  messages,
}: {
  messages: typeof initialChatData[0]["chatDetails"]["messages"];
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-white">
      {messages.map((msg, index) => (
        <ChatBubble key={index} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// --- Main Page ---
export default function TenantChatPage() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [activeMenu, setActiveMenu] = useState("Messages");
  const [chatData, setChatData] = useState(initialChatData);

  const handleSendMessage = (content: string, chatId: number) => {
    if (!content.trim()) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(),
      sender: "user",
      content,
      time: timeString,
    };

    setChatData((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: content,
              chatDetails: {
                ...chat.chatDetails,
                messages: [...chat.chatDetails.messages, newMessage],
              },
            }
          : chat
      )
    );

    // Auto Reply
    setTimeout(() => {
      const autoReplies = [
        "Got it! Let me confirm that for you.",
        "Thanks for your message, I'll respond shortly.",
        "Appreciate your patience! I’m checking the details.",
        "Okay, I’ll get back to you soon with updates.",
      ];
      const reply =
        autoReplies[Math.floor(Math.random() * autoReplies.length)];

      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setChatData((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: reply,
                chatDetails: {
                  ...chat.chatDetails,
                  messages: [
                    ...chat.chatDetails.messages,
                    {
                      id: Date.now() + 1,
                      sender: "other",
                      content: reply,
                      time: replyTime,
                    },
                  ],
                },
              }
            : chat
        )
      );
    }, 1500);
  };

  const activeChat =
    chatData.find((chat) => chat.id === activeChatId) || chatData[0];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <TenantSidebar setActiveMenu={setActiveMenu} activeMenu={activeMenu} />

      {/* Main Chat Panel */}
      <main className="flex-1 flex flex-col min-h-screen bg-white">
        <ChatPanelHeader
          title={activeChat.chatDetails.title}
          location={activeChat.chatDetails.location}
        />

        <ChatWindow messages={activeChat.chatDetails.messages} />

        <ChatInput onSend={(msg) => handleSendMessage(msg, activeChatId)} />
      </main>
    </div>
  );
}
