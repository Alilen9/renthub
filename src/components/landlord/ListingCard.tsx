"use client";

import React, { useEffect, useState } from "react";

interface ListingFile {
  name: string;
  type: string;
  previewUrl?: string; // stored string
}

interface ListingCardProps {
  title: string;
  price: number;
  location: string;
  files?: (File | ListingFile)[]; // ✅ Handle both
  onDelete?: () => void; // ✅ new prop for deleting
}

export default function ListingCard({
  title,
  price,
  location,
  files = [],
  onDelete,
}: ListingCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrl(null);
      return;
    }

    const firstFile = files[0];

    if (firstFile instanceof File) {
      // ✅ Handle fresh uploads
      const url = URL.createObjectURL(firstFile);
      setPreviewUrl(url);
      setIsVideo(firstFile.type.startsWith("video"));
      return () => URL.revokeObjectURL(url);
    } else {
      // ✅ Handle saved ListingFile
      setPreviewUrl(firstFile.previewUrl || null);
      setIsVideo(firstFile.type?.startsWith("video"));
    }
  }, [files]);

  return (
    <div className="col-span-1 border rounded-lg shadow-sm p-3 bg-white">
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          isVideo ? (
            <video
              src={previewUrl}
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={previewUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <span className="text-gray-400">No media</span>
        )}
      </div>

      <div className="font-semibold text-black">{title}</div>
      <div className="text-sm text-gray-500">Ksh {price.toLocaleString()}</div>
      <div className="text-sm text-gray-600">{location}</div>

      <div className="mt-3 flex gap-2">
        <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
          View
        </button>
        <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
          Analytics
        </button>

        {/* ✅ New Clear button */}
        <button
          onClick={onDelete}
          className="text-sm px-3 py-1 border rounded text-red-600 hover:bg-red-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
