"use client";

import React from "react";
import Link from "next/link";
import { ListingDraft } from "@/components/landlord/types";

interface Props {
  listings: ListingDraft[];
  views?: { [key: string]: number };
}

export default function PropertyAccess({ listings, views = {} }: Props) {
  const shown = listings.slice(0, 3); // only show 3 on the dashboard

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black"> Property Quick Access</h2>
        <Link href="/landlord/property" className="text-sm text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      {/* Show properties */}
      {shown.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shown.map((property, index) => {
            // create a safe id (use real id if present, otherwise fall back to index+sanitized title)
            const sanitizedTitle =
              (typeof property.title === "string" ? property.title : "property")
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9\-]/g, "")
                .toLowerCase();
            const propertyId = property.id ?? `${index}-${sanitizedTitle}`;

            // choose a sensible key/title for views lookup
            const viewsKey = (property.title && String(property.title)) || propertyId;
            const viewCount = views[viewsKey] ?? 0;

            // safe price rendering
            const priceNumber =
              typeof property.price === "number" ? property.price : Number(property.price) || 0;

            return (
              <Link
                key={propertyId}
                href={`/landlord/properties/${propertyId}`}
                className="block border rounded-lg p-4 hover:shadow-md transition relative"
              >
                {/* View count badge */}
                <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                  👁 {viewCount}
                </span>

                <h3 className="font-semibold">{property.title ?? "Untitled property"}</h3>
                <p className="text-sm text-gray-600">{String(property.county ?? "")}</p>
                <p className="text-sm font-semibold text-gray-800">
                  Ksh {priceNumber.toLocaleString()}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">
  No properties yet.{" "}
  <Link href="/landlord/add-listing" className="text-blue-600 underline">
    Add one now
  </Link>
</p>

      )}
    </div>
  );
}
