// app/spn/ratings/page.tsx
"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";

// Dummy ratings
const ratingsData = [
  { id: 1, landlord: "Alice Mkangoma", rating: 5, feedback: "Excellent service!" },
  { id: 2, landlord: "John Doe", rating: 4, feedback: "Good, but arrived late." },
  { id: 3, landlord: "Jane Smith", rating: 5, feedback: "Highly recommend!" },
];

export default function SPNRatingsPage() {
  return (
    <div className="flex">
      <SPNSidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-black">Ratings</h1>

        <div className="space-y-4">
          {ratingsData.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-xl shadow text-black">
              <h2 className="font-semibold">{r.landlord}</h2>
              <p>Rating: {r.rating} ⭐</p>
              <p>Feedback: {r.feedback}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
