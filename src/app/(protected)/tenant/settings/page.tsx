"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Loader2 } from "lucide-react";
import {
  fetchTenantSettings,
  updateTenantProfile,
  updateTenantNotification,
} from "@/services/settingsService";
import { updatePassword } from "@/services/authService";

export default function SettingsPage() {
  // Profile State
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    email_notifications: false,
    sms_notifications: false,
    app_notifications: false,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Other State
  const [referralLink] = useState("https://renthub.com/ref/Alice123");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings = await fetchTenantSettings();
      if (settings) {
        const { full_name, email, phone, email_notifications, sms_notifications, app_notifications } = settings;
        setProfile({ full_name, email, phone });
        setNotifications({ email_notifications, sms_notifications, app_notifications });
      } else {
        throw new Error("Failed to fetch settings");
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      const response = await updateTenantProfile(profile) as { success: boolean; message?: string; error?: string };
      if (response.success) {
        alert(response.message || "Profile updated successfully!");
      } else {
        throw new Error(response.error || "Failed to update profile");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleNotificationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedNotifications = { ...notifications, [name]: checked };
    setNotifications(updatedNotifications);

    try {
      await updateTenantNotification({ [name]: checked });
      // Optionally show a small success toast/message here instead of an alert
    } catch (err: any) {
      alert(`Error updating notification: ${err.message}`);
      // Revert state on error
      setNotifications({ ...notifications, [name]: !checked });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    try {
      const response = await updatePassword(passwords);
      if (response.success) {
        alert(response.message || "Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "" });
      } else {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#C81E1E]" />
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white text-black overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#58181C] mb-8">
          Settings <span><Settings/></span>
        </h1>

        {/* Profile Settings */}
        <section className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">
            Profile Settings
          </h2>
          <div className="space-y-3">
            <input
              name="full_name"
              type="text"
              placeholder="Full Name"
              value={profile.full_name || ''}
              onChange={handleProfileChange}
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={profile.email || ''}
              onChange={handleProfileChange}
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={profile.phone || ''}
              onChange={handleProfileChange}
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <button onClick={handleProfileSave} className="bg-[#C81E1E] text-white px-6 py-2 rounded-lg hover:bg-[#58181C] transition font-medium">
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
              <input
                name="email_notifications"
                type="checkbox"
                checked={notifications.email_notifications}
                onChange={handleNotificationChange} /> Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <input
                name="sms_notifications"
                type="checkbox"
                checked={notifications.sms_notifications}
                onChange={handleNotificationChange} /> SMS Notifications
            </label>
            <label className="flex items-center gap-2">
              <input
                name="app_notifications"
                type="checkbox"
                checked={notifications.app_notifications}
                onChange={handleNotificationChange} /> App Notifications
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
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="border border-gray-300 p-3 rounded-lg w-full text-black"
            />
            <button onClick={handlePasswordUpdate} className="bg-[#C81E1E] text-white px-6 py-2 rounded-lg hover:bg-[#58181C] transition font-medium">
              Update Password
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
