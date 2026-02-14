// app/(protected)/spn/help/page.tsx
"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState } from "react";

const faqs = [
  { id: 1, question: "How to update my profile?", answer: "Go to the profile page and click edit." },
  { id: 2, question: "How to view earnings?", answer: "Navigate to the Wallet page to view your earnings." },
  { id: 3, question: "How to contact support?", answer: "Use the chat feature on the Messages page." },
  { id: 4, question: "How to complete a task?", answer: "Accept tasks from your dashboard and mark them as completed once done." },
  { id: 5, question: "How to verify my account?", answer: "Go to the Verification page and follow the instructions to submit documents." },
];

export default function SPNHelpPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered FAQs based on search
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <SPNSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Help & Support</h1>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-600 text-black bg-white"
            />
          </div>

          {/* FAQ List */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            {filteredFaqs.length === 0 ? (
              <p className="text-black text-sm">No FAQs found for your search.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="mb-4">
                  <button
                    className="w-full text-left p-3 bg-gray-50 rounded-lg flex justify-between items-center text-black font-medium hover:bg-gray-100 transition"
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <span className="text-black font-bold">{openId === faq.id ? "-" : "+"}</span>
                  </button>
                  {openId === faq.id && (
                    <p className="p-3 text-sm text-black border-l-2 border-indigo-600 bg-gray-50 rounded-b-lg transition-all duration-300 ease-in-out">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
