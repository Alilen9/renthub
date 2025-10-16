"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const cityImages = [
  {
    name: "Nairobi",
    url: "/images/NAIROBI.jpg", // local image
  },
  {
    name: "Mombasa",
    url: "/images/MOMBASA.jpg", // local image
  },
  {
    name: "Kisumu",
    url: "/images/KISUMU.jpg", // local image
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Cycle background every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cityImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Rotating background */}
      {cityImages.map((city, i) => (
        <div
          key={city.name}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${city.url})` }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Find your next home or tenant with trust and ease
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <input
            type="text"
            placeholder="Search by Location, Budget, or Property Type"
            className="flex-1 px-5 py-3 text-gray-800 focus:outline-none text-sm md:text-base"
          />
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-white font-medium transition rounded-r-full">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* City label */}
        <p className="mt-4 text-sm text-gray-200 italic">
          Currently showcasing: {cityImages[index].name}
        </p>
      </div>
    </section>
  );
}
