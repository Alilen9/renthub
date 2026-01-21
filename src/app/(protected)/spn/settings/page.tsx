"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState } from "react";

export default function SPNSettingsPage() {
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("spn@example.com");
  const [phone, setPhone] = useState("+254 712 345 678");
  const [address, setAddress] = useState("123 Nairobi Street, Kenya");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [availability, setAvailability] = useState("available");

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    taskEmail: true,
    messageSMS: false,
    newJobAlerts: true,
  });

  const handleNotificationChange = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings updated!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <SPNSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto text-black">
        <h1 className="text-3xl font-bold mb-8 text-black">Settings</h1>

        <form className="space-y-10 max-w-4xl" onSubmit={handleSubmit}>
          {/* ---------------- Profile Section ---------------- */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200 text-black">
            <h2 className="text-2xl font-semibold mb-6 text-black">Profile</h2>

            <div className="flex items-center gap-6 mb-6">
              <img
                src="/default-avatar.png"
                alt="Profile"
                className="w-24 h-24 rounded-full border object-cover"
              />
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-black"
              >
                Change Photo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-black">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>
          </section>

          {/* ---------------- Notifications ---------------- */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-black">Notifications</h2>

            <div className="space-y-4 text-black">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications.taskEmail}
                  onChange={() => handleNotificationChange("taskEmail")}
                  className="w-5 h-5"
                />
                <span>Receive task updates via email</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications.messageSMS}
                  onChange={() => handleNotificationChange("messageSMS")}
                  className="w-5 h-5"
                />
                <span>Receive messages via SMS</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notifications.newJobAlerts}
                  onChange={() => handleNotificationChange("newJobAlerts")}
                  className="w-5 h-5"
                />
                <span>Get new job alerts</span>
              </label>
            </div>
          </section>

          {/* ---------------- Availability Settings ---------------- */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Availability
            </h2>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
            >
              <option value="available">Available for tasks</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </section>

          {/* ---------------- Security ---------------- */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Security
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </section>

          {/* ---------------- Danger Zone ---------------- */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-black">Danger Zone</h2>

            <p className="mb-4 text-black">
              Deleting your account is permanent and cannot be undone.
            </p>

            <button
              type="button"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Account
            </button>
          </section>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
