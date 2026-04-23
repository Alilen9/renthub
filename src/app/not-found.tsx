"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, MessageCircle, Building2, User } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-gray-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-20 w-20 text-[#C81E1E] opacity-80" />
          </div>
        </div>

        {/* RentHub Branding */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#C81E1E]">RentHub</h2>
          <p className="text-sm text-gray-500">Your Trusted Rental Platform</p>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Oops! The page you&apos;re looking for seems to have moved or doesn&apos;t exist.
            Don&apos;t worry, we&apos;ll get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#C81E1E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#58181C] transition shadow-md"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </div>
        </div>

        {/* User Type Options */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Find Your Dashboard</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/tenant/dashboard"
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition border border-gray-200"
            >
              <User className="h-8 w-8 text-[#C81E1E]" />
              <div className="text-center">
                <p className="font-medium text-gray-900">Tenant</p>
                <p className="text-sm text-gray-500">Find properties</p>
              </div>
            </Link>

            <Link
              href="/landlord/dashboard"
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition border border-gray-200"
            >
              <Building2 className="h-8 w-8 text-[#C81E1E]" />
              <div className="text-center">
                <p className="font-medium text-gray-900">Landlord</p>
                <p className="text-sm text-gray-500">Manage listings</p>
              </div>
            </Link>

            <Link
              href="/spn/dashboard"
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition border border-gray-200"
            >
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">SP</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Service Provider</p>
                <p className="text-sm text-gray-500">View tasks</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">Need help? We&apos;re here to assist</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="mailto:support@renthub.co.ke"
              className="inline-flex items-center gap-2 text-[#C81E1E] hover:text-[#58181C] font-medium transition"
            >
              <MessageCircle className="h-4 w-4" />
              support@renthub.co.ke
            </a>
            <span className="text-gray-400 hidden sm:block">|</span>
            <a
              href="tel:+254700000000"
              className="inline-flex items-center gap-2 text-[#C81E1E] hover:text-[#58181C] font-medium transition"
            >
              📞 +254 700 000 000
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}