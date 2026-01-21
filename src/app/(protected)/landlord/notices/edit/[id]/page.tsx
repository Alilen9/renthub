"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type NoticeFile = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // For images
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

export default function EditNotice() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.id as string;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const [files, setFiles] = useState<NoticeFile[]>([]);

  const staffMembers = ["John Doe", "Jane Smith", "Mark Lee", "Alice Kinona"];

  useEffect(() => {
    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    const notice = stored.find((n) => n.id === noticeId);
    if (notice) {
      setTitle(notice.title);
      setMessage(notice.message);
      setCategory(notice.category);
      setPriority(notice.priority);
      setAssignedStaff(notice.assignedStaff);
      setFiles(notice.files || []);
    }
  }, [noticeId]);

  const toggleStaff = (staff: string) => {
    setAssignedStaff((prev) =>
      prev.includes(staff) ? prev.filter((s) => s !== staff) : [...prev, staff]
    );
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const newFiles = await Promise.all(
      selectedFiles.map(async (f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
        dataUrl: f.type.startsWith("image/") ? await toBase64(f) : undefined,
      }))
    );
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const saveNotice = () => {
    if (!title || !message || !category || assignedStaff.length === 0)
      return alert("Fill all fields");

    const stored: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
    const updated = stored.map((n) =>
      n.id === noticeId
        ? { ...n, title, message, category, priority, assignedStaff, files }
        : n
    );
    localStorage.setItem("notices", JSON.stringify(updated));
    router.push("/landlord/notices");
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Form */}
      <div className="flex-1 bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h1 className="text-3xl font-bold text-[#58181C] text-center mb-6">
          Edit Notice
        </h1>

        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">Title</label>
          <input
            type="text"
            placeholder="Enter notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#C81E1E]"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">Message</label>
          <textarea
            placeholder="Enter notice message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded h-36 text-black focus:outline-none focus:ring-2 focus:ring-[#C81E1E]"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#C81E1E]"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Billing">Billing</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#C81E1E]"
          >
            <option value="Normal">Normal</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Assign Staff */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">Assign Staff</label>
          <div className="flex flex-wrap gap-3">
            {staffMembers.map((staff) => (
              <label key={staff} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assignedStaff.includes(staff)}
                  onChange={() => toggleStaff(staff)}
                  className="accent-[#C81E1E]"
                />
                <span className="text-black">{staff}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Attachments */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-black">
            Attach Files (Images or PDFs)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="text-black"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <li key={idx} className="flex flex-col items-center">
                  {file.dataUrl ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ) : (
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {file.name} (PDF)
                    </span>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="mt-1 text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Save Notice Button */}
        <button
          onClick={saveNotice}
          className="w-full p-4 rounded-lg font-bold bg-[#C81E1E] text-white hover:bg-[#58181C] transition"
        >
          Save Changes
        </button>
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-gray-50 shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#58181C] text-center">
          Live Preview
        </h2>
        <div className="border border-gray-300 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">
              {title || "Title goes here"}
            </h3>
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                priority === "Urgent"
                  ? "bg-red-600"
                  : priority === "Important"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {priority}
            </span>
          </div>
          <p className="text-black">{message || "Message goes here..."}</p>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <span>Category: {category || "N/A"}</span>
            <span>
              Staff: {assignedStaff.length > 0 ? assignedStaff.join(", ") : "None"}
            </span>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              <h4 className="font-semibold text-black">Attached Files:</h4>
              <ul className="text-sm text-gray-700 flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex flex-col items-center">
                    {file.dataUrl ? (
                      <img
                        src={file.dataUrl}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                        {file.name} (PDF)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
