"use client";

import { useState } from "react";
 // ✅ make sure this import path matches your project
import { useRouter } from "next/navigation";
import TenantSidebar from "@/components/tenants/TenantSidebar";

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("Settings");
  const [referralLink] = useState("https://renthub.com/ref/Alice123");
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white text-black overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#58181C] mb-8">
          Settings ⚙️
        </h1>

        {/* Profile Settings */}
        <section className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">
            Profile Settings
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <button className="bg-[#C81E1E] text-white px-6 py-2 rounded-lg hover:bg-[#58181C] transition font-medium">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-3 text-black">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> SMS Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> App Notifications
            </label>
          </div>
        </section>

        {/* Referral Program 🎁 */}
        <section className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">
            Referral Program 🎁
          </h2>
          <p className="text-black mb-3">
            Invite your friends to join RentHub and earn{" "}
            <b>10% off</b> your next rent!
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="border border-gray-300 p-3 rounded-lg flex-1 text-black"
            />
            <button
              onClick={handleCopy}
              className="bg-[#F4C542] text-[#58181C] px-5 py-2 rounded-lg hover:bg-[#F4C542]/80 font-medium transition"
            >
              Copy Link
            </button>
          </div>
        </section>

        {/* Security & Password */}
        <section className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">
            Security & Password
          </h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <button className="bg-[#C81E1E] text-white px-6 py-2 rounded-lg hover:bg-[#58181C] transition font-medium">
              Update Password
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
