"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import AuthModal from "./auth/authmodal";

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold z-50">
            <span className={isScrolled ? 'text-rose-600' : 'text-white'}>RentHub</span>
          </Link>

          {/* Navigation */}
<nav className="hidden md:flex items-center space-x-6 font-medium z-50">
  <Link
    href="#home"
    className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-rose-600 transition`}
  >
    Home
  </Link>
  <Link
    href="#properties"
    className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-rose-600 transition`}
  >
    Properties
  </Link>
  <Link
    href="#services"
    className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-rose-600 transition`}
  >
    Services
  </Link>
  <Link
    href="#about"
    className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-rose-600 transition`}
  >
    About us
  </Link>
  <Link
    href="#contact"
    className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-rose-600 transition`}
  >
    Contact
  </Link>
</nav>

          {/* Login / Sign Up Button */}
          <button
            onClick={() => setAuthOpen(true)}
            className={`ml-4 px-4 py-2 rounded-md font-semibold transition z-50
              ${isScrolled ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'}
            `}
          >
            Login / Sign Up
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
