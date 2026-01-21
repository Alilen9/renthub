"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlusCircle, FiFile, FiEdit, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

type NoticeFile = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // For images stored as Base64
};

type Notice = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  assignedStaff: string[];
  files?: NoticeFile[];
  createdAt: string;
};

export default function LandlordNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    const stored = JSON.parse(localStorage.getItem("notices") || "[]");
    setNotices(stored.reverse());
  };

  const deleteNotice = (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    const updated = notices.filter((n) => n.id !== id);
    localStorage.setItem("notices", JSON.stringify(updated.reverse()));
    setNotices(updated);
  };

  const editNotice = (id: string) => {
    router.push(`/landlord/notices/edit/${id}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#58181C]">Notices</h1>
        <Link
          href="/landlord/notices/create"
          className="px-4 py-2 bg-[#C81E1E] text-white rounded flex items-center gap-2 hover:bg-[#58181C] transition"
        >
          <FiPlusCircle /> Add Notice
        </Link>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {notices.length === 0 && (
          <p className="text-gray-500">No notices posted yet.</p>
        )}

        {notices.map((n) => (
          <div
            key={n.id}
            className="p-5 border rounded-xl shadow-sm bg-white flex flex-col gap-3"
          >
            {/* Title and Priority */}
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl text-black">{n.title}</h2>
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  n.priority === "Urgent"
                    ? "bg-red-600"
                    : n.priority === "Important"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {n.priority || "Normal"}
              </span>
            </div>

            {/* Message */}
            <p className="text-black">{n.message}</p>

            {/* Category & Assigned Staff */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="px-2 py-1 bg-gray-200 rounded">{n.category || "General"}</span>
              {n.assignedStaff && n.assignedStaff.length > 0 && (
                <span className="px-2 py-1 bg-gray-200 rounded">
                  Staff: {n.assignedStaff.join(", ")}
                </span>
              )}
            </div>

            {/* File Attachments */}
            {n.files && n.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {n.files.map((file, idx) => {
                  if (file.type.startsWith("image/") && file.dataUrl) {
                    return (
                      <img
                        key={idx}
                        src={file.dataUrl}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    );
                  } else if (file.type === "application/pdf") {
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                      >
                        <FiFile />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Edit & Delete Buttons */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => editNotice(n.id)}
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => deleteNotice(n.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                <FiTrash2 /> Delete
              </button>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-400 mt-2">
              Posted on: {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
