

import FeaturedApartments from "@/components/Home/FeaturedApartments";
import Hero from "@/components/Home/hero";

import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      <FeaturedApartments />
    </main>
  );
}
