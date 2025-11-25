"use client";

import React, { useState, useRef } from "react";

export default function LandlordSettingsPage() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+254712345678",
    password: "",
    confirmPassword: "",
    notifications: true,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Settings saved successfully (API connection coming soon)");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        ⚙️ Account Settings
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white shadow-md rounded-2xl p-6 space-y-8"
      >
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-rose-500 cursor-pointer group"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                Upload
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
              Change
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">
            Click the circle to upload or change profile picture
          </p>
        </div>

        {/* Profile Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            👤 Profile Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🔐 Change Password
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🔔 Notifications
          </h2>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
              className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              Receive payment and tenant notifications
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2 rounded-xl shadow-sm transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
