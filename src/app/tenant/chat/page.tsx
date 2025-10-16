"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiKey,
  FiCalendar,
} from "react-icons/fi";

// 🎨 Tunyce Colors
const colors = {
  maroon: "#58181C",
  red: "#C81E1E",
  yellow: "#F4C542",
};

// --- Sidebar ---
function TenantSidebar({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}) {
  const router = useRouter();

  const goTo = (path: string, menu: string) => {
    setActiveMenu(menu);
    router.push(path);
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col shadow-lg"
      style={{ backgroundColor: colors.maroon }}
    >
      <div className="p-6 border-b border-[#C81E1E]/50">
        <h1 className="text-2xl font-bold" style={{ color: colors.yellow }}>
            RentHub
        </h1>
        <p className="text-sm text-gray-300 mt-1">Your Rental Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <button
          onClick={() => goTo("/tenant/dashboard", "Dashboard")}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Dashboard"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiHome /> <span>Dashboard</span>
        </button>

        <button
          onClick={() =>
            router.push(`/tenant/lease-finalization/BKG12345`)
          }
          className="flex items-center gap-3 w-full p-3 rounded-lg font-medium bg-[#F4C542] text-[#58181C] hover:bg-[#F4C542]/90 transition shadow-md"
        >
          <FiKey /> <span>Finalize Move-in</span>
        </button>

        <button
          onClick={() => goTo("/tenant/booking-system", "Booking")}
          className="flex items-center gap-3 w-full p-3 rounded-lg font-medium bg-[#C81E1E]/90 text-white hover:bg-[#C81E1E] transition shadow-md"
        >
          <FiCalendar /> <span>Book a Viewing</span>
        </button>

        <button
          onClick={() => goTo("/tenant/chat", "Messages")}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Messages"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiMessageSquare /> <span>Messages</span>
        </button>

        <button
          onClick={() => goTo("/tenant/settings", "Settings")}
          className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition ${
            activeMenu === "Settings"
              ? "bg-[#C81E1E] text-white shadow-md"
              : "text-gray-200 hover:bg-[#C81E1E]/80"
          }`}
        >
          <FiSettings /> <span>Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-[#C81E1E]/50">
        <button
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-300 hover:bg-[#C81E1E]/70 hover:text-white transition"
          onClick={() => router.push("/")}
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

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
          content:
            "Hello! We received your inquiry. How can we help you today?",
          time: "9:50 AM",
        },
        {
          id: 102,
          sender: "other",
          content:
            "Understood. I'll get back to you with an official reply shortly.",
          time: "10:06 AM",
        },
      ],
    },
  },
];

// --- Chat Components ---
function ChatListItem({
  chat,
  isActive,
  onClick,
}: {
  chat: typeof initialChatData[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer flex items-start space-x-3 transition-colors duration-200 ${
        isActive
          ? "bg-[#F4C542]/20 border-l-4 border-[#C81E1E]"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-semibold flex-shrink-0 ${
          isActive ? "bg-[#C81E1E]" : "bg-gray-400"
        }`}
      >
        {chat.profileInitials}
      </div>
      <div className="flex-1 overflow-hidden">
        <p
          className={`font-semibold truncate ${
            isActive ? "text-[#C81E1E]" : "text-gray-800"
          }`}
        >
          {chat.name}
        </p>
        <p
          className={`text-sm truncate ${
            isActive ? "text-[#58181C]" : "text-gray-500"
          }`}
        >
          {chat.lastMessage}
        </p>
      </div>
      {chat.unread && (
        <div className="w-2 h-2 rounded-full bg-[#F4C542] flex-shrink-0"></div>
      )}
    </div>
  );
}

function ChatPanelHeader({ title, location }: { title: string; location: string }) {
  const router = useRouter();

  const handleBookViewing = () => {
    router.push(`/tenant/booking-system?listing=${encodeURIComponent(location)}`);
  };

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
        onClick={handleBookViewing}
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
            : "bg-gray-200 text-gray-800 rounded-bl-none"
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
        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C81E1E] text-gray-700"
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
    <div className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-gray-50">
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

    // 💬 Auto Reply
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
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
