"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ListingDraft } from "@/components/landlord/types";

interface Props {
  listings: ListingDraft[];
  views: { [key: string]: number };
}

export default function PropertyAnalytics({ listings, views }: Props) {
  const data =
    listings.length > 0
      ? listings.map((l) => ({
          name: l.title || "Property",
          views: views[l.title || "Property"] || 0,
        }))
      : [
          { name: "2BR Apartment", views: 250 },
          { name: "Studio Ruiru", views: 180 },
          { name: "Bungalow", views: 320 },
        ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📊 Property Views Analytics</h2>
        <span className="text-sm text-gray-500">Last updated just now</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
