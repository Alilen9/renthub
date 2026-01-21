// src/components/tenants/MessagingSystem.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiHome, FiCalendar, FiInbox } from "react-icons/fi"; 

// --- Mock Data Structures ---

interface Message {
  id: number;
  sender: 'tenant' | 'landlord';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  withUser: string;
  role: 'Landlord';
  listingTitle: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    withUser: "John Landlord",
    role: "Landlord",
    listingTitle: "Modern Apartment on Elm St",
    messages: [
      { id: 1, sender: "landlord", text: "Hello! Thanks for your interest in the apartment. What's your expected move-in date?", timestamp: "10:00 AM" },
      { id: 2, sender: "tenant", text: "Hi John, I'm aiming for November 1st. Is the listing price negotiable?", timestamp: "10:05 AM" },
      { id: 3, sender: "landlord", text: "The price is firm, but we can discuss the duration of the lease. Let me know if you'd like to schedule a viewing.", timestamp: "10:15 AM" },
    ],
  },
  {
    id: 2,
    withUser: "Jane Doe Rentals",
    role: "Landlord",
    listingTitle: "Cozy Studio near Downtown",
    messages: [
      { id: 4, sender: "tenant", text: "I've submitted my application for the studio. What is the typical review time?", timestamp: "Yesterday" },
      { id: 5, sender: "landlord", text: "We are reviewing it now and should have an answer by tomorrow!", timestamp: "Yesterday" },
    ],
  },
];

const HEADER_BG = 'white'; 

// --- Messaging Component ---

interface MessagingSystemProps {
    handleBookViewing: (listingTitle: string) => void;
}

export default function MessagingSystem({ handleBookViewing }: MessagingSystemProps) {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation, conversations]); 

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId || !selectedConversation) return;

    const currentText = newMessage.toLowerCase().trim();

    const newMsg: Message = {
      id: Date.now(),
      sender: "tenant",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Add the tenant's new message immediately
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedConversationId
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );

    setNewMessage("");


    // 2. Simulate a delayed Landlord response with more realistic logic
    const landlordResponse = (text: string): Message => ({
        id: Date.now() + 1,
        sender: "landlord",
        text: text,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
    });
    
    let responseText = "Thanks for your message! I'll get back to you shortly.";
    
    if (currentText.includes("viewing") || currentText.includes("book") || currentText.includes("see")) {
        responseText = `I see you're interested in scheduling a viewing for the ${selectedConversation.listingTitle}. Please use the **Book Viewing** button in the header above to check my real-time availability and select a slot.`;
    } else if (currentText.includes("negotiable") || currentText.includes("price") || currentText.includes("rent")) {
        responseText = "The advertised price is currently firm, but we offer a $50 discount for leases 18 months or longer. Is that something you'd consider?";
    } else if (currentText.includes("move-in") || currentText.includes("date")) {
        responseText = "The apartment will be vacant and ready for move-in on November 1st. Are you looking to move in around that time?";
    } else if (currentText.includes("pets") || currentText.includes("dog") || currentText.includes("cat")) {
        responseText = "We allow one small pet (under 25lbs) with an additional $50/month pet rent and a non-refundable $300 pet fee. Does that work for you?";
    } else if (currentText.includes("application")) {
        responseText = "Our application review process usually takes 2-3 business days. I'll notify you immediately once a decision has been made!";
    }


    setTimeout(() => {
        setConversations(prevConversations =>
            prevConversations.map(conv =>
                conv.id === selectedConversationId
                    ? { ...conv, messages: [...conv.messages, landlordResponse(responseText)] }
                    : conv
            )
        );
    }, 1500);
  };

  return (
    // ⭐ Main container uses h-full to fit the parent container
    <div className="flex h-full bg-white rounded-lg shadow-xl overflow-hidden">
      {/* 1. Conversation List (Sidebar) */}
      <div className="w-80 border-r bg-gray-50 p-2 overflow-y-auto flex-shrink-0">
        <div className="p-2 border-b mb-2" style={{ backgroundColor: HEADER_BG }}>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FiInbox className="mr-2 h-5 w-5 text-green-600" /> Chats
          </h3>
        </div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConversationId(conv.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              conv.id === selectedConversationId
                ? "bg-green-100 border-l-4 border-green-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
                <FiUser className="text-gray-500 mr-2" />
                <span className="truncate">{conv.withUser}</span>
            </div>
            <p className="text-sm text-gray-500 truncate ml-5">
                {conv.messages[conv.messages.length - 1]?.text}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header (Contains the Book Viewing Button) */}
            <div className="p-4 border-b bg-green-700 text-white flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">{selectedConversation.withUser}</h4>
                <p className="text-sm opacity-90 flex items-center">
                    <FiHome className="mr-1 h-3 w-3" /> {selectedConversation.listingTitle}
                </p>
              </div>
                {/* Book Viewing Button */}
                <button
                    onClick={() => handleBookViewing(selectedConversation.listingTitle)}
                    className="flex items-center gap-1 px-3 py-2 bg-white text-green-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition shadow"
                >
                    <FiCalendar className="w-4 h-4" /> Book Viewing
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "tenant" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow ${
                      message.sender === "tenant"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className={`block mt-1 text-xs ${message.sender === "tenant" ? "text-green-200" : "text-gray-500"} text-right`}>
                        {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-green-500 focus:border-green-500 text-gray-900" 
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  aria-label="Send message"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
} 