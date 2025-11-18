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
  LineChart,
  Line,
} from "recharts";
import { ListingDraft } from "@/components/landlord/types";

interface Props {
  listings: ListingDraft[];
  views: { [key: string]: number };
  faultsPerMonth?: { month: string; faults: number }[];
  rentCollectionRate?: { month: string; rate: number }[];
  tenantSatisfaction?: { month: string; rating: number }[];
}

export default function LandlordDashboard({
  listings,
  views,
  faultsPerMonth,
  rentCollectionRate,
  tenantSatisfaction,
}: Props) {
  // Property views data
  const listingData =
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

  // Faults per month
  const faultsData = faultsPerMonth ?? [
    { month: "Jan", faults: 5 },
    { month: "Feb", faults: 3 },
    { month: "Mar", faults: 4 },
    { month: "Apr", faults: 6 },
  ];

  // Rent collection rate
  const rentData = rentCollectionRate ?? [
    { month: "Jan", rate: 90 },
    { month: "Feb", rate: 85 },
    { month: "Mar", rate: 92 },
    { month: "Apr", rate: 88 },
  ];

  // Tenant satisfaction
  const satisfactionData = tenantSatisfaction ?? [
    { month: "Jan", rating: 4 },
    { month: "Feb", rating: 3.5 },
    { month: "Mar", rating: 4.2 },
    { month: "Apr", rating: 4.5 },
  ];

  return (
    <div className="space-y-8">
      {/* Property Views */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">
            Property Views Analytics
          </h2>
          <span className="text-sm text-black">Last updated just now</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={listingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#000", fontWeight: 600 }}
              />
              <YAxis tick={{ fill: "#000", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", borderRadius: 8 }}
                itemStyle={{ color: "#000", fontWeight: 600 }}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]} fill="#58181C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Faults per Month */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-black mb-4">
          Faults Reported Per Month
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={faultsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#000" }} />
              <YAxis tick={{ fill: "#000" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", borderRadius: 8 }}
              />
              <Bar dataKey="faults" fill="#C81E1E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rent Collection Rate */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-black mb-4">
          Rent Collection Rate (%)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#000" }} />
              <YAxis tick={{ fill: "#000" }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#58181C"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tenant Satisfaction */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-black mb-4">
          Tenant Satisfaction Rating
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#000" }} />
              <YAxis tick={{ fill: "#000" }} domain={[0, 5]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFF", borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#F4C542"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
