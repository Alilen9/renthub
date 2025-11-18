"use client";

import { useParams } from "next/navigation";
import { Star } from "lucide-react";

// TEMP DATA – later replace with API
const serviceProviders = [
  {
    id: 1,
    name: "John Doe",
    trade: "Plumber",
    rating: 4.5,
    experience: 3,
    services: [
      { title: "Leak Repair", price: "From KES 500" },
      { title: "Pipe Installation", price: "From KES 1500" },
    ],
    about:
      "Licensed and experienced plumber specializing in residential piping, leak repairs and kitchen/bathroom installs.",
    skills: ["Plumbing", "Pipe Fitting", "Leak Detection"],
    reviews: [
      { author: "Alice", rating: 5, text: "Very fast and professional!", date: "2025-10-02" },
      { author: "Mark", rating: 4, text: "Job was done well.", date: "2025-09-20" },
    ],
  },
];

export default function SPNPublicProfile() {
  const { id } = useParams();
  const sp = serviceProviders.find((p) => p.id === Number(id));

  if (!sp) return <div className="p-8 text-black">Provider not found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        {/* Header */}
        <div className="flex items-center gap-6">
          <img
            src="/default-avatar.png"
            className="w-24 h-24 rounded-full border"
            alt={sp.name}
          />
          <div>
            <h1 className="text-3xl font-bold text-black">{sp.name}</h1>
            <p className="text-black">{sp.trade}</p>

            <div className="flex items-center mt-2 gap-2">
              <Star size={18} className="text-yellow-500" />
              <span className="font-semibold text-black">{sp.rating}</span>
              <span className="text-black">( {sp.experience} yrs experience )</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Message SPN
          </button>
          <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Assign Task
          </button>
        </div>

        {/* About */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-black">About</h2>
          <p className="text-black text-sm">{sp.about}</p>
        </div>

        {/* Services */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-black">Services</h2>
          <div className="space-y-2">
            {sp.services.map((srv, idx) => (
              <div key={idx} className="flex justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-black">{srv.title}</span>
                <span className="text-black">{srv.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-black">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {sp.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm bg-gray-200 rounded-full text-black"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-black">Reviews</h2>

          <div className="space-y-3">
            {sp.reviews.map((r, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-black">{r.author}</span>
                  <span className="text-black flex items-center gap-1">
                    {r.rating} <Star size={14} className="text-yellow-500" />
                  </span>
                </div>
                <p className="text-sm text-black mt-2">{r.text}</p>
                <p className="text-xs text-gray-500 mt-1">{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
