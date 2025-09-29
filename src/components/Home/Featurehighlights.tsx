"use client";

import { ShieldCheck, MessageCircle, CreditCard, MapPin } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "Safe, trusted properties",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    desc: "Chat between landlord & tenant",
  },
  {
    icon: CreditCard,
    title: "Secure Escrow Payments",
    desc: "Safe transactions every time",
  },
  {
    icon: MapPin,
    title: "Location-Based Search",
    desc: "Find homes near you easily",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
          >
            <Icon className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-black font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
