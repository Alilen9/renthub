"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiMessageSquare,
  FiCalendar,
  FiLoader,
  FiAlertTriangle,
} from "react-icons/fi"; // Using react-icons for consistency
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  fetchTenantChats,
  fetchChatMessages,
  replyToChat,
} from "@/services/chatService";

export type ChatListItemType = {
  id: number;
  landlord_name: string;
  last_message: string;
  unread_count: number;
};

export type MessageType = {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string;
};

// --- Chat Components ---
function ChatListItem({
  chat,
  isActive,
  onClick,
}: {
  chat: ChatListItemType;
  isActive: boolean;
  onClick: () => void;
}) {
  // Function to get initials from a name
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <button
      className={`w-full text-left p-4 border-b border-gray-100 flex items-start space-x-3 transition-colors duration-200 ${
        isActive
          ? "bg-[#F4C542]/20 border-l-4 border-[#C81E1E]"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div // eslint-disable-line jsx-a11y/interactive-supports-focus
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-semibold flex-shrink-0 ${
          isActive ? "bg-[#C81E1E]" : "bg-gray-400"
        }`}
      >
        {getInitials(chat.landlord_name)}
      </div>
      <div className="flex-1 overflow-hidden">
        <p
          className={`font-semibold truncate ${
            isActive ? "text-[#C81E1E]" : "text-gray-800"
          }`}
        >
          {chat.landlord_name}
        </p>
        <p
          className={`text-sm truncate ${
            isActive ? "text-[#58181C]" : "text-gray-500"
          }`}
        >
          {chat.last_message}
        </p>
      </div>
      {chat.unread_count > 0 && (
        <div className="w-2 h-2 rounded-full bg-[#F4C542] flex-shrink-0"></div>
      )}
    </button>
  );
}

function ChatPanelHeader({ title, location, isTyping }: { title: string; location?: string, isTyping?: boolean }) {
  const router = useRouter();

  const handleBookViewing = () => {
    router.push(`/tenant/booking-system?listing=${encodeURIComponent(location ?? '')}`);
  };

  const titleContent = (
    <div>
      <h2 className="text-xl font-bold text-[#58181C]">{title || "Select a Chat"}</h2>
      {isTyping && <p className="text-sm text-gray-500 italic">typing...</p>}
    </div>
  );

  return (
    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div>
        {titleContent}
        {location && !isTyping && (
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <span className="inline-block w-2 h-2 bg-[#F4C542] rounded-full mr-2"></span>
            {location}
          </p>
        )}
      </div>
      {location && <button
        onClick={handleBookViewing}
        className="px-5 py-2 bg-[#C81E1E] text-white text-sm font-medium rounded-lg hover:bg-[#58181C] transition flex items-center space-x-2 shadow-md"
      >
        <FiCalendar className="w-4 h-4" />
        <span>Book Viewing</span>
      </button>}
    </div>
    );
}  

function ChatBubble({
  message,
  currentUserId,
}: {
  message: MessageType;
  currentUserId: number | null;
}) {
  const isUser = message.sender_id === currentUserId;
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
        {message.created_at && (
          <div
            className={`text-xs mt-1 ${
              isUser ? "text-[#F4C542]" : "text-gray-500"
            } text-right`}
          >
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatInput({ onSend, onTyping }: { onSend: (message: string) => void, onTyping: () => void }) {
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onTyping();

    typingTimeoutRef.current = setTimeout(() => {
      // In a real app, you'd emit a 'stop typing' event here.
    }, 3000); // Assume user stops typing after 3 seconds of inactivity
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-4">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C81E1E] text-gray-700"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="w-12 h-12 flex items-center justify-center bg-[#C81E1E] text-white rounded-full hover:bg-[#58181C] transition shadow-lg"
      >
        <FiMessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}

function ChatWindow({ messages, currentUserId }: { messages: MessageType[], currentUserId: number | null }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div role="log" className="flex-1 px-6 py-4 overflow-y-auto space-y-2 bg-gray-50">
      {messages.map((msg, index) => (
        <ChatBubble key={index} message={msg} currentUserId={currentUserId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// --- Main Page ---
export default function TenantChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatListItemType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch all chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoadingChats(true);
        const rawChatList = await fetchTenantChats();
        const chatList: ChatListItemType[] = rawChatList.map((ticket: any) => ({
          id: ticket.id,
          landlord_name: ticket.subject, // Mapping from API response
          last_message: ticket.latest_message || "No messages yet.", // Mapping from API response
          unread_count: ticket.unread_count || 0, // Assuming this property exists or defaulting
        }));
        setChats(chatList); 
        if (chatList.length > 0) {
          setActiveChatId(chatList[0].id);
        }
      } catch (err: unknown) {
        setError("Failed to load chats. Please refresh the page.");
        console.error(err);
      } finally {
        setLoadingChats(false);
      }
    };
    loadChats();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const chatDetails = await fetchChatMessages(activeChatId);
        const messages: MessageType[] = chatDetails.messages.map((msg: any) => ({
          id: msg.id,
          chat_id: chatDetails.id,
          sender_id: msg.user_id,
          content: msg.message, // Mapping from API response
          created_at: msg.created_at,
        }));
        setMessages(messages);
      } catch (err: unknown) {
        setError("Failed to load messages for this chat.");
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeChatId]);

  // Simulate receiving a "typing" event from the other user
  useEffect(() => {
    if (!activeChatId) return;

    // Simulate landlord typing 2 seconds after you open a chat
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
      // Simulate landlord stops typing after 3 seconds
      const stopTypingTimer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(stopTypingTimer);
    }, 2000);

    return () => clearTimeout(typingTimer);
  }, [activeChatId]);

  const handleSendMessage = async (content: string) => {
    if (!activeChatId) return;

    const optimisticMessage: MessageType = {
      id: Date.now(), // Temporary ID
      chat_id: activeChatId,
      sender_id: user?.id ?? 0,
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await replyToChat(activeChatId, content);
      const newMessages = await fetchChatMessages(activeChatId);
      const messages: MessageType[] = newMessages.messages.map((msg: any) => ({
        id: msg.id,
        chat_id: newMessages.id,
        sender_id: msg.user_id,
        content: msg.message,
        created_at: msg.created_at,
      }));
      setMessages(messages);
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, last_message: content } : chat
      ));
    } catch (err: unknown) {
      console.error("Failed to send message:", err);
      setError("Error: Could not send your message. Please try again.");
      setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id));
    }
  };

  const handleTyping = () => {
    // In a real application, you would emit a 'typing' event
    // to the server via WebSockets here.
    console.log("User is typing...");
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Panel */}
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#58181C]">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center items-center h-full">
              <FiLoader className="animate-spin text-[#C81E1E] w-8 h-8" />
            </div>
          ) : error && chats.length === 0 ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet.</div>
          ) : (
            chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => setActiveChatId(chat.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <ChatPanelHeader
              title={activeChat.landlord_name}
              // Assuming you might add property info to the chat list item in the future
              isTyping={isTyping}
              // location={activeChat.property_name}
            />
            {error && (
              <div className="p-2 bg-red-100 text-red-700 text-sm text-center">
                <FiAlertTriangle className="inline mr-2" />
                {error}
              </div>
            )}
            {loadingMessages ? (
              <div className="flex-1 flex justify-center items-center bg-gray-50">
                <FiLoader className="animate-spin text-[#C81E1E] w-8 h-8" />
              </div>
            ) : (
              <ChatWindow messages={messages} currentUserId={user?.id ?? null} />
            )}
            <ChatInput onSend={handleSendMessage} onTyping={handleTyping} />
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 text-gray-500">
            {!loadingChats && (
              <>
                <FiMessageSquare className="w-16 h-16 mb-4" />
                <h2 className="text-xl font-semibold">Select a conversation</h2>
                <p>Start by choosing a chat from the list on the left.</p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
