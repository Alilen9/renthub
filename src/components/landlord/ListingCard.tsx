"use client";

import React from "react";
import { ListingFile } from "./types";
import { Trash2, Eye } from "lucide-react";

export interface ListingCardProps {
  title: string;
  description: string;
  price: number;
  location: string;
  media: ListingFile[]; // ✅ changed from "files"
  onDelete?: () => void;
}

export default function ListingCard({
  title,
  description,
  price,
  location,
  media,
  onDelete,
}: ListingCardProps) {
  const primaryMedia = media && media.length > 0 ? media[0] : null;
export default function ListingCard(
  { apartment }: ListingCardProps) {
  const previewImage =
    apartment.image_urls?.[0] || '/placeholder-image.png';


  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      {/* Media Preview */}
      <div className="relative w-full h-48 bg-gray-100">
        {primaryMedia ? (
          primaryMedia.type === "video" ? (
            <video
              src={primaryMedia.url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={primaryMedia.url}
              alt={primaryMedia.name}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Media
          </div>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
            title="Delete Listing"
          >
            <Trash2 className="text-red-600" size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-rose-600 font-semibold">
            Ksh {price?.toLocaleString()}
          </span>
          <span className="text-gray-500 text-sm">{location}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-rose-600 transition">
            <Eye size={16} /> View
          </button>
        </div>
      </div>
    </div>
  );
}
