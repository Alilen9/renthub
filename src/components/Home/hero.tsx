"use client";

import { useEffect, useState } from "react";
import { Search, ShieldCheck, MessageCircle, CreditCard, MapPin } from "lucide-react";
import FeaturedApartments from "./FeaturedApartments";
import { ContactUsFormData } from "@/utils/contactUs";
import { sendContactInquiry } from "@/services/contactService";

// Hero city images
const cityImages = [
  { name: "Nairobi", url: "/images/NAIROBI.jpg" },
  { name: "Mombasa", url: "/images/MOMBASA.jpg" },
  { name: "Kisumu", url: "/images/KISUMU.jpg" },
];

// Feature highlights for About Us
const features = [
  { icon: ShieldCheck, title: "Verified Listings", desc: "Safe, trusted properties" },
  { icon: MessageCircle, title: "Direct Messaging", desc: "Chat between landlord & tenant" },
  { icon: CreditCard, title: "Secure Escrow Payments", desc: "Safe transactions every time" },
  { icon: MapPin, title: "Location-Based Search", desc: "Find homes near you easily" },
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const [contactForm, setContactForm] = useState<ContactUsFormData>({ full_name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hero background cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cityImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-sans">

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {cityImages.map((city, i) => (
          <div
            key={city.name}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${city.url})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Find your next home or tenant with trust and ease
          </h1>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-rose-600 transition">
            <input
              type="text"
              placeholder="Search by Location, Budget, or Property Type"
              className="flex-1 px-5 py-3 text-gray-800 focus:outline-none text-sm md:text-base"
            />
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 px-6 py-3 text-white font-medium transition rounded-r-full">
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-200 italic drop-shadow">
            Currently showcasing: {cityImages[index].name}
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-16 bg-gray-50">
        <FeaturedApartments/>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Services</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            At RentHub, we make renting simple and trustworthy. We offer:
            <br /><br />
            <strong>Property Listings:</strong> Easily list and browse properties with detailed info.<br />
            <strong>Tenant Matching:</strong> Find the perfect tenant or rental property quickly.<br />
            <strong>Verified Profiles:</strong> Secure and reliable for landlords and tenants.<br />
            <strong>Rental Management:</strong> Track payments, invoices, and rental history.<br />
            <strong>Maintenance Support:</strong> Submit requests and connect with trusted providers.<br />
            <strong>Market Insights:</strong> Stay informed with rental trends in your city.
          </p>
        </div>
      </section>

      {/* About Section with Feature Highlights */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">About Us</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
            RentHub is Kenya’s trusted platform for connecting landlords and tenants seamlessly. 
            Our mission is to make renting simple, safe, and transparent for everyone. 
            Whether you’re looking for your next home or seeking reliable tenants, 
            RentHub offers verified listings, smart search features, and real-time updates.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transform hover:-translate-y-1 transition"
              >
                <Icon className="w-10 h-10 text-rose-600 mb-4" />
                <h3 className="text-black font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">Contact Us</h2>
          <p className="text-center text-gray-700 mb-12">
            Have questions or want to list your property? Reach out to us!
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-gray-800"><strong>Email:</strong> info@renthub.com</p>
              <p className="text-gray-800"><strong>Phone:</strong> +254 712 345 678</p>
              <p className="text-gray-800"><strong>Address:</strong> Nairobi, Kenya</p>
            </div>

           {/* Contact Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(contactForm.email)) {
                  alert("Please enter a valid email address.");
                  return;
                }
                setIsSubmitting(true);
                try {
                  await sendContactInquiry(contactForm);
                  alert(`✅ Inquiry sent successfully!\n\nName: ${contactForm.full_name}\nEmail: ${contactForm.email}`);
                  setContactForm({ full_name: "", email: "", message: "" });
                } catch {
                  alert("Failed to send inquiry. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="bg-gray-50 p-6 rounded-2xl shadow-md flex flex-col space-y-4"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.full_name}
                onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })}
                required
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-600 text-black"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-600 text-black"
              />
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                className="border border-gray-300 rounded-md px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-rose-600 text-black"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-md transition disabled:bg-rose-400"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/254712345678"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg flex items-center justify-center z-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.52 3.48A11.928 11.928 0 0012 0C5.373 0 0 5.373 0 12a11.93 11.93 0 001.84 6.52L0 24l5.48-1.84A11.928 11.928 0 0012 24c6.627 0 12-5.373 12-12 0-3.21-1.248-6.22-3.48-8.52zm-8.52 19.02c-2.4 0-4.67-.78-6.52-2.1l-.47-.3-3.26 1.1 1.1-3.26-.31-.47a9.936 9.936 0 01-2.1-6.52c0-5.52 4.48-10 10-10 2.66 0 5.17 1.04 7.07 2.93a9.932 9.932 0 012.93 7.07c0 5.52-4.48 10-10 10zm5.52-7.5c-.28-.14-1.64-.81-1.89-.9-.25-.09-.44-.14-.63.14-.19.28-.73.9-.89 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.13-.57.14-.14.31-.32.47-.48.15-.16.2-.28.3-.47.1-.19.05-.36-.03-.5-.08-.14-.63-1.52-.87-2.08-.23-.55-.46-.48-.63-.49-.16 0-.34-.01-.52-.01s-.48.07-.73.36c-.25.28-.95.93-.95 2.28s.97 2.64 1.1 2.82c.14.19 1.9 2.9 4.61 4.07.64.28 1.14.45 1.53.58.64.21 1.23.18 1.69.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.12-.25-.19-.52-.33z" />
          </svg>
        </a>
      </section>

    </div>
  );
}
