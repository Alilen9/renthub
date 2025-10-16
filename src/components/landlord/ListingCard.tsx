"use client";

import React from "react";
import { ListingFile } from "./types";

export interface ListingCardProps {
  title: string;
  description: string;
  price: number;
  location: string;
  files: ListingFile[];
  onDelete?: () => void;
}

export default function ListingCard({
  title,
  description,
  price,
  location,
  files,
  onDelete,
}: ListingCardProps) {
  const previewImage =
    files && files.length > 0
      ? (files[0] as any).previewUrl || (files[0] as any).url
      : "/placeholder.jpg";

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img
        src={previewImage}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="text-gray-600 text-sm">{location}</p>
        <p className="text-rose-600 font-semibold mt-2">Ksh {price}</p>

        <div className="flex justify-between items-center mt-4">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            View
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-sm text-rose-600 hover:text-rose-800"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
