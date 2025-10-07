"use client";

import { listings } from "@/lib/mockData";
import {
  Bed,
  MapPin,
  Square,
  BadgeCheck,
  Calendar,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const formatKES = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default function ListingDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const listing = listings.find((l) => String(l.id) === id);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, currentImage]);

  if (!listing) {
    return (
      <div className="p-10 text-center text-gray-600">
        ❌ Property not found.
      </div>
    );
  }

  // Pricing comparison
  const sameAreaListings = listings.filter(
    (l) => l.location === listing.location && l.id !== listing.id
  );
  const avgPrice =
    sameAreaListings.length > 0
      ? sameAreaListings.reduce((sum, l) => sum + l.price, 0) /
        sameAreaListings.length
      : listing.price;

  const fairText =
    listing.price < avgPrice
      ? "✅ This property is cheaper than average for this area."
      : listing.price > avgPrice
      ? "⚠️ This property is more expensive than average."
      : "ℹ️ This property is fairly priced for this area.";

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 flex gap-2 items-center">
          <Link href="/tenant/dashboard" className="hover:underline flex items-center gap-1">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <span>/</span>
          <Link href="/tenant/listings" className="hover:underline">Listings</Link>
          <span>/</span>
          <span className="font-medium text-gray-800">{listing.title}</span>
        </div>

        {/* Title + Price Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
              {listing.title}
              {listing.verified && (
                <BadgeCheck className="w-6 h-6 text-green-500" />
              )}
            </h1>
            <p className="flex items-center text-gray-500 mt-2">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              {listing.location}
            </p>
          </div>
          <span className="text-4xl font-extrabold text-red-700 mt-4 md:mt-0">
            {formatKES(listing.price)}
          </span>
        </div>

        {/* Virtual Tour + Gallery */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {listing.virtualTourUrl && (
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[350px]">
              <iframe
                src={listing.virtualTourUrl}
                className="w-full h-full"
                allow="fullscreen; vr"
                loading="lazy"
              />
            </div>
          )}

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 h-[350px]">
            {listing.images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl shadow-sm hover:scale-105 transform transition cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={img}
                  alt={`${listing.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        {listing.description && (
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              About this property
            </h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Features + Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl shadow-sm">
              <Bed className="w-6 h-6 text-red-600" />
              <span className="text-gray-800 font-medium">
                {listing.beds} Bedrooms
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl shadow-sm">
              <Square className="w-6 h-6 text-indigo-600" />
              <span className="text-gray-800 font-medium">
                {listing.area} Sq Ft
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl shadow-sm">
              <MapPin className="w-6 h-6 text-yellow-600" />
              <span className="text-gray-800 font-medium">{listing.location}</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
            <ul className="grid grid-cols-2 gap-3 text-gray-600">
              <li>✅ Parking Space</li>
              <li>✅ Wi-Fi</li>
              <li>✅ Balcony</li>
              <li>✅ Security 24/7</li>
            </ul>
          </div>
        </div>

        {/* Pricing Insights */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-lg font-semibold text-gray-800">
            Average rent in {listing.location}:{" "}
            <span className="text-red-700">{formatKES(avgPrice)}</span>
          </p>
          <p className="text-gray-600 mt-1">{fairText}</p>
        </div>

        {/* Landlord Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <User className="w-12 h-12 text-gray-400 border rounded-full p-2" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">John Mwangi</h3>
            <p className="text-sm text-gray-500">Verified Landlord</p>
            <div className="flex gap-1 text-yellow-500 mt-1">
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500" />
              <Star className="w-4 h-4 text-gray-300" />
            </div>
          </div>
          <Link
            href="/tenant/chat"
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-700 transition"
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link
            href="/tenant/book-viewing"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          >
            <Calendar className="w-5 h-5" />
            Book Viewing
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
          >
            ← Back to Listings
          </button>
        </div>

        {/* Similar Properties */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Similar properties nearby
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sameAreaListings.slice(0, 3).map((sim) => (
              <div
                key={sim.id}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
              >
                <img
                  src={sim.images[0]}
                  alt={sim.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800">{sim.title}</h3>
                <p className="text-sm text-gray-500">{sim.location}</p>
                <p className="text-red-600 font-bold">{formatKES(sim.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/20"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white p-2 rounded-full hover:bg-white/20"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={listing.images[currentImage]}
            alt="Property"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-6 text-white p-2 rounded-full hover:bg-white/20"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
