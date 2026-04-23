"use client";

import Image from "next/image";
import {
  Bed,
  MapPin,
  Square,
  BadgeCheck,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Home,
  Calendar,
  Shield,
  Wifi,
  Car,
  Droplets,
  Flame,
  Wind,
  CheckCircle2,
  Heart,
  Share2,
  Phone,
  Mail,
  Building2,
  FileText,
  MessageSquare,
  CalendarCheck,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { fetchApartmentById, fetchApartments } from "@/services/houseService";
import { Apartment } from "@/utils";

const formatKES = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default function ListingDetailsClient({ id }: { id: string }) {
  const [listing, setListing] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sameAreaListings, setSameAreaListings] = useState<Apartment[]>([]);

  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(String(id));
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch the specific apartment
  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchApartmentById(id);
        if (data) {
          setListing(data);
          // Also fetch similar properties from the same location
          try {
            const allApartments = await fetchApartments();
            const similar = allApartments.filter(
              (apt) => apt.location === data.location && String(apt.id) !== id
            );
            setSameAreaListings(similar);
          } catch (err) {
            console.error("Failed to fetch similar listings:", err);
          }
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id]);

  const nextImage = useCallback(() => {
    if (listing && listing.image_urls) setCurrentImage((prev) => (prev + 1) % listing.image_urls.length);
  }, [listing]);

  const prevImage = useCallback(() => {
    if (listing && listing.image_urls) setCurrentImage((prev) => (prev - 1 + listing.image_urls.length) % listing.image_urls.length);
  }, [listing]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, currentImage, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 py-8 px-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C81E1E] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 py-8 px-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-4">❌ {error || "Property not found"}</p>
            <Link href="/tenant/dashboard" className="text-[#C81E1E] hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Pricing comparison
  const avgPrice =
    sameAreaListings.length > 0
      ? sameAreaListings.reduce((sum, l) => sum + Number(l.price), 0) /
        sameAreaListings.length
      : Number(listing.price);

  const fairText =
    Number(listing.price) < avgPrice
      ? "✅ This property is cheaper than average for this area."
      : Number(listing.price) > avgPrice
      ? "⚠️ This property is more expensive than average."
      : "ℹ️ This property is fairly priced for this area.";

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  // Property features
  const propertyFeatures = [
    { icon: <Wifi className="w-5 h-5" />, label: "High-Speed Wi-Fi" },
    { icon: <Car className="w-5 h-5" />, label: "Parking Space" },
    { icon: <Shield className="w-5 h-5" />, label: "24/7 Security" },
    { icon: <Droplets className="w-5 h-5" />, label: "Hot Water" },
    { icon: <Flame className="w-5 h-5" />, label: "Cooking Gas" },
    { icon: <Wind className="w-5 h-5" />, label: "Air Conditioning" },
  ];

  // Lease terms
  const leaseTerms = {
    deposit: Number(listing.price) * 0.1,
    duration: "12 months",
    paymentDue: "1st of every month",
    utilitiesIncluded: ["Water", "Garbage collection"],
  };

  // Property rules
  const propertyRules = [
    "No smoking inside the property",
    "Pets allowed with written consent",
    "Quiet hours: 10 PM - 6 AM",
    "No subletting without approval",
    "Regular inspections with 24hr notice",
  ];

  // Ensure image_urls is an array
  const images = Array.isArray(listing.image_urls) ? listing.image_urls : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 py-8 px-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Breadcrumbs */}
          <div className="text-sm text-black flex gap-2 items-center">
            <Link href="/tenant/dashboard" className="hover:underline flex items-center gap-1">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
            <span>/</span>
            <Link href="/tenant/dashboard" className="hover:underline">Listings</Link>
            <span>/</span>
            <span className="font-medium text-gray-800">{listing.name || listing.title || "Property Details"}</span>
          </div>

          {/* Title + Price + Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
                {listing.name || listing.title}
                {(listing.is_verified || listing.verified) && <BadgeCheck className="w-6 h-6 text-[#F4C542]" />}
              </h1>
              <p className="flex items-center text-gray-500 mt-2">
                <MapPin className="w-5 h-5 mr-2 text-[#C81E1E]" />
                {listing.location}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{listing.beds ?? "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <Square className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{listing.area ?? "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-4xl font-extrabold text-[#C81E1E]">
                {formatKES(Number(listing.price))}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleSave(String(id))}
                  className="p-3 rounded-full border-2 transition-colors"
                  style={{
                    borderColor: saved ? "#C81E1E" : "#E5E7EB",
                    color: saved ? "#C81E1E" : "#6B7280",
                    backgroundColor: saved ? "rgba(200, 30, 30, 0.1)" : "transparent"
                  }}
                >
                  <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                </button>
                <button className="p-3 rounded-full border border-gray-200 text-gray-600 hover:text-[#C81E1E] hover:border-[#C81E1E] transition">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {listing.virtualTourUrl && (
              <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[350px]">
                <iframe src={listing.virtualTourUrl} className="w-full h-full" allow="fullscreen; vr" loading="lazy" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 h-[350px]">
              {images.length > 0 ? (
                images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl shadow-sm hover:scale-105 transform transition cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <Image src={img} alt={`${listing.name || listing.title} ${idx + 1}`} className="w-full h-full object-cover" width={400} height={300} />
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-xl">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {listing.description && listing.description.trim() !== "" ? (
            <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C81E1E]" />
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          ) : null}

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Specs */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-2xl font-bold text-gray-900">{listing.beds ?? "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="text-2xl font-bold text-gray-900">{listing.area ?? "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-2xl font-bold text-gray-900">{listing.category || listing.type || "Apartment"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-2xl font-bold text-gray-900 truncate" title={listing.location}>{listing.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Verified</p>
                    <p className="text-2xl font-bold text-gray-900">{listing.is_verified || listing.verified ? "Yes" : "No"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Listed by</p>
                    <p className="text-2xl font-bold text-gray-900 truncate" title={listing.landlord_username}>
                      {listing.landlord_username || listing.business_name || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {propertyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-700">{feature.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lease Terms */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C81E1E]" />
                  Lease Terms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-bold text-lg text-[#C81E1E]">{formatKES(Number(listing.price))}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-semibold text-gray-900">{formatKES(leaseTerms.deposit)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Lease Duration</span>
                      <span className="font-semibold text-gray-900">{leaseTerms.duration}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3">
                      <span className="text-gray-600">Rent Due Date</span>
                      <span className="font-semibold text-gray-900">{leaseTerms.paymentDue}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Utilities Included</h3>
                    <ul className="space-y-2">
                      {leaseTerms.utilitiesIncluded.map((util, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {util}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Property Rules */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Property Rules
                </h2>
                <ul className="space-y-3">
                  {propertyRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Contact Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Interested in this property?</h3>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-[#C81E1E] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#58181C] transition shadow-md"
                    >
                      <CalendarCheck className="h-5 w-5" />
                      Book a Viewing
                    </button>

                    <Link
                      href="/tenant/chat"
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      <MessageSquare className="h-5 w-5" />
                      Send Inquiry
                    </Link>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Property Manager</p>
                    <div className="flex items-center gap-3 mt-2 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {listing.landlord_username || listing.business_name || "Property Manager"}
                        </p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          {listing.is_verified || listing.verified ? "Verified" : "Landlord"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <a href="tel:+254700000000" className="flex items-center gap-2 text-gray-700 hover:text-[#C81E1E]">
                        <Phone className="w-4 h-4" />
                        +254 700 000 000
                      </a>
                      <a
                        href={`mailto:${(listing.landlord_username || listing.business_name || "manager").toLowerCase()}@renthub.co.ke`}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#C81E1E]"
                      >
                        <Mail className="w-4 h-4" />
                        {(listing.landlord_username || listing.business_name || "manager").toLowerCase()}@renthub.co.ke
                      </a>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Quick Booking
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Schedule a viewing to reserve this property. Escrow payment secures your booking.
                  </p>
                  <Link
                    href={`/tenant/booking-system?property=${listing.id}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Start Booking Process
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Price Insights */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-lg font-semibold text-gray-800">
              Average rent in {listing.location}: <span className="text-[#C81E1E]">{formatKES(avgPrice)}</span>
            </p>
            <p className="text-gray-600 mt-1">{fairText}</p>
          </div>

          {/* Landlord Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <User className="w-12 h-12 text-gray-400 border rounded-full p-2" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {listing.landlord_username || listing.business_name || "Property Manager"}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                {listing.is_verified || listing.verified ? "Verified Landlord" : "Landlord"}
              </p>
              <div className="flex gap-1 text-[#F4C542] mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill={i < 4 ? "#F4C542" : "none"} />
                ))}
              </div>
            </div>
            <Link href="/tenant/chat" className="px-4 py-2 bg-[#C81E1E] text-white rounded-lg font-medium shadow hover:bg-[#58181C] transition">
              Contact
            </Link>
          </div>

          {/* Similar Properties */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C81E1E]" />
              Similar properties nearby
            </h2>
            {sameAreaListings.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {sameAreaListings.slice(0, 5).map((sim) => (
                  <div
                    key={sim.id}
                    className="snap-center flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                  >
                    <div className="relative h-44">
                      {sim.image_urls && Array.isArray(sim.image_urls) && sim.image_urls.length > 0 ? (
                        <Image
                          src={sim.image_urls[0]}
                          alt={sim.name || sim.title || "Property"}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                          width={300}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#C81E1E] text-white text-sm px-3 py-1 rounded-full shadow-md">
                        {formatKES(Number(sim.price))}
                      </div>
                      {sim.is_verified || sim.verified ? (
                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </div>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{sim.name || sim.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 truncate">{sim.location}</p>
                      <Link href={`/tenant/listing/${sim.id}`} className="inline-block text-[#C81E1E] font-medium hover:underline text-sm">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No similar properties found in this area.</p>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Book a Viewing</h2>
              <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Property</p>
              <p className="font-semibold">{listing.name || listing.title}</p>
              <p className="text-sm text-gray-500">{listing.location}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C81E1E] focus:border-transparent"
              />
            </div>

            {selectedDate && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Booking Fee (Escrow)</span>
                  <span className="font-bold text-[#C81E1E]">{formatKES(leaseTerms.deposit)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  This is a refundable deposit held in escrow. You&apos;ll be redirected to complete payment.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <Link
                href={selectedDate ? `/tenant/booking-system?property=${listing.id}&date=${selectedDate}` : "#"}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-center transition ${
                  selectedDate ? "bg-[#C81E1E] text-white hover:bg-[#58181C]" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={(e) => { if (!selectedDate) e.preventDefault(); }}
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/20 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 text-white p-2 rounded-full hover:bg-white/20 z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <div className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentImage]}
              alt={`${listing.name || listing.title} ${currentImage + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              width={1200}
              height={800}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 text-white p-2 rounded-full hover:bg-white/20 z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
