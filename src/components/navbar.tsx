"use client";

import { useState } from "react";
import AuthModal from "./auth/authmodal";


export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">LetHub</h1>
          <button
            onClick={() => setAuthOpen(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Login / Sign Up
          </button>
        </div>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
