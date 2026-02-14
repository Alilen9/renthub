// src/components/upload/FileUploader.tsx
"use client";

import { useRef, useState } from "react";
import Button from "../ui/Button";
import type { ListingFile } from "../landlord/types"; // ✅ use central type

interface FileUploaderProps {
  onFilesSelected: (files: (File | ListingFile)[]) => void;
  selectedFiles: (File | ListingFile)[];
}

export default function FileUploader({
  onFilesSelected,
  selectedFiles,
}: FileUploaderProps) {
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter((f) => f.size <= maxSize);

    if (validFiles.length !== files.length) {
      setError("Some files exceed the 10MB limit.");
    } else {
      setError("");
    }

    // ✅ keep both uploaded and already-selected (ListingFile + File)
    onFilesSelected([...(selectedFiles || []), ...validFiles]);
  };

  const handleClear = () => {
    onFilesSelected([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
    }
  };

  const isFile = (f: File | ListingFile): f is File => f instanceof File;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Upload photos / videos / 360 media
      </label>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="block w-full border border-gray-300 rounded-lg p-2"
        onChange={handleFileChange}
      />

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="text-sm text-gray-600 list-disc ml-4">
          {selectedFiles.map((f, i) => (
            <li key={i}>
              {isFile(f) ? f.name : f.name} {/* ✅ works for both */}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
