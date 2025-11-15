"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNotice() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const [files, setFiles] = useState<
    { file: File; dataUrl?: string }[]
  >([]);

  const staffMembers = ["John Doe", "Jane Smith", "Mark Lee", "Alice Kinona"];

  const toggleStaff = (staff: string) => {
    setAssignedStaff((prev) =>
      prev.includes(staff)
        ? prev.filter((s) => s !== staff)
        : [...prev, staff]
    );
  };

  // Convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const filesWithData = await Promise.all(
      selectedFiles.map(async (f) => ({
        file: f,
        dataUrl: f.type.startsWith("image/") ? await toBase64(f) : undefined,
      }))
    );
    setFiles(filesWithData);
  };

  const saveNotice = () => {
    if (!title || !message || !category || assignedStaff.length === 0)
      return alert("Fill all fields");

    const stored = JSON.parse(localStorage.getItem("notices") || "[]");
    const newNotice = {
      id: Date.now().toString(),
      title,
      message,
      category,
      priority,
      assignedStaff,
      files: files.map((f) => ({
        name: f.file.name,
        type: f.file.type,
        size: f.file.size,
        dataUrl: f.dataUrl,
      })),
      createdAt: new Date().toISOString(),
      readBy: [],
    };
    stored.push(newNotice);
    localStorage.setItem("notices", JSON.stringify(stored));
    router.push("/landlord/notices");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Form */}
      <div className="flex-1 bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h1 className="text-3xl font-bold text-[#58181C] text-center mb-6">
          Post New Notice
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
            <ul className="mt-2 text-sm text-gray-700">
              {files.map((f, idx) => (
                <li key={idx}>
                  {f.file.name} ({(f.file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Post Notice Button */}
        <button
          onClick={saveNotice}
          className="w-full p-4 rounded-lg font-bold bg-[#C81E1E] text-white hover:bg-[#58181C] transition"
        >
          Post Notice
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
                {files.map((f, idx) => (
                  <li key={idx} className="flex flex-col items-center">
                    {f.file.type.startsWith("image/") && f.dataUrl ? (
                      <img
                        src={f.dataUrl}
                        alt={f.file.name}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ) : f.file.type === "application/pdf" ? (
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                        {f.file.name} (PDF)
                      </span>
                    ) : null}
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
