"use client";

import { getLandlordProfile, updateLandlordProfile } from "@/services/landlordService";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

interface SettingsForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  notifications: boolean;
}

export default function LandlordSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getLandlordProfile();
        setForm({
          name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          notifications: profile.notifications,
          password: "",
          confirmPassword: "",
        });
        if (profile.profile_image_url) {
          setProfileImage(profile.profile_image_url);
        }
      } catch (error) {
        toast.error("Failed to load profile settings.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving settings...");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("notifications", String(form.notifications));

    if (form.password) {
      formData.append("password", form.password);
    }
    if (profileImageFile) {
      formData.append("profile_image", profileImageFile);
    }

    try {
      await updateLandlordProfile(formData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      toast.dismiss(toastId);
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
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

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-pulse">
        <h1 className="h-8 bg-gray-300 rounded w-1/3 mb-6"></h1>
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-gray-300"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-10 bg-gray-300 rounded-xl"></div>
              <div className="h-10 bg-gray-300 rounded-xl"></div>
              <div className="h-10 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-10 bg-gray-300 rounded-xl"></div>
              <div className="h-10 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none text-black"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none text-black"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none text-black"
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
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none text-black"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-rose-500 outline-none text-black"
                placeholder="Leave blank to keep current"
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
            disabled={isSaving}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2 rounded-xl shadow-sm transition disabled:bg-rose-400 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
