"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy data
const serviceProviders = [
  { id: 1, name: "John Doe", trade: "Plumber", rating: 4.5 },
  { id: 2, name: "Jane Smith", trade: "Electrician", rating: 4.8 },
  { id: 3, name: "Mike Johnson", trade: "Cleaner", rating: 4.2 },
  { id: 4, name: "Anna Lee", trade: "Painter", rating: 4.7 },
];

export default function ServiceProviderPage() {
  const router = useRouter();
  const [assignModal, setAssignModal] = useState<{ open: boolean; providerId?: number }>({ open: false });

  const openAssignModal = (id: number) => setAssignModal({ open: true, providerId: id });
  const closeAssignModal = () => setAssignModal({ open: false });

  const viewProfile = (id: number) => {
    router.push(`/landlord/spn/${id}`); // navigate to SPN profile page
  };

  return (
    <div className="flex flex-col p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-black">Service Provider Network</h1>

      {/* Search / Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search provider..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black shadow-sm"
        />
        <select className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-black shadow-sm">
          <option value="">All Trades</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Painter">Painter</option>
        </select>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceProviders.map((sp) => (
          <div
            key={sp.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-xl text-black mb-1">{sp.name}</h2>
              <p className="text-black mb-2">{sp.trade}</p>
              <p className="text-yellow-500 font-medium">⭐ {sp.rating}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => openAssignModal(sp.id)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold"
              >
                Assign Task
              </button>
              <button
                onClick={() => viewProfile(sp.id)}
                className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition font-semibold"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Task Modal */}
      {assignModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4 text-black">Assign Task</h2>
            <p className="mb-6 text-black font-medium">
              Assign task to:{" "}
              {serviceProviders.find((sp) => sp.id === assignModal.providerId)?.name}
            </p>

            <form className="space-y-4">
              <select className="w-full p-3 border rounded-lg text-black shadow-sm">
                <option value="">Select Property</option>
                <option value="Property 1">Property 1</option>
                <option value="Property 2">Property 2</option>
              </select>
              <textarea
                placeholder="Task Description"
                className="w-full p-3 border rounded-lg text-black shadow-sm resize-none h-24"
              />
              <input type="date" className="w-full p-3 border rounded-lg text-black shadow-sm" />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeAssignModal}
                  className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Assign
                </button>
              </div>
            </form>

            <button
              onClick={closeAssignModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
