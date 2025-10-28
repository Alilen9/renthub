// src/app/booking/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookingReview from "@/components/tenants/BookingReview";
import BookingCalendar from "@/components/tenants/BookingCalendar";


// --- Helper Component: Payment Placeholder (STEP 3) ---
const BookingPayment = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="p-8 border border-blue-200 rounded-xl bg-blue-50 shadow-lg text-center">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Secure Payment</h3>
      <p className="text-gray-600 mb-6">
        A security deposit is required to finalize the booking.
      </p>
      <div className="text-4xl font-extrabold text-blue-700 mb-8">$500.00</div>
      <button
        onClick={handlePay}
        disabled={isProcessing}
        className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition duration-150 shadow-md flex items-center justify-center ${
          isProcessing
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                 5.291A7.962 7.962 0 014 12H0c0
                 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          "Confirm and Pay Deposit"
        )}
      </button>
    </div>
  );
};

// --- Progress Bar ---
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: "Select Date & Time" },
    { id: 2, name: "Contact Details" },
    { id: 3, name: "Payment" },
    { id: 4, name: "Booking Confirmed" },
  ];

  return (
    <nav className="flex items-center space-x-4 mb-8">
      {steps.map((s, index) => (
        <div key={s.id} className="flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${
              currentStep >= s.id ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <p
            className={`text-sm mt-2 transition-colors duration-300 text-center ${
              currentStep >= s.id
                ? "text-green-700 font-semibold"
                : "text-gray-500"
            }`}
          >
            {s.name}
          </p>
        </div>
      ))}
    </nav>
  );
};

// --- Main Booking System Component ---
function CompleteBookingSystem({
  listingName = "Luxury Apartment 3B",
}: {
  listingName?: string;
}) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const router = useRouter();

  const handleDateAndTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(2);
  };

  const handleContactDetailsSubmit = ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    setContactDetails({ name, email });
    setStep(3);
  };

  const handlePaymentSuccess = () => {
    console.log(
      `Final Booking (Post-Payment): ${listingName} on ${selectedDate} at ${selectedTime}. User: ${contactDetails?.name}, ${contactDetails?.email}`
    );
    setStep(4);
  };

  const renderContent = () => {
    if (step === 1) {
      return <BookingCalendar onSelect={handleDateAndTimeSelect} />;
    }
    if (step === 2 && selectedDate && selectedTime) {
      return (
        <BookingReview
          date={selectedDate}
          time={selectedTime}
          listingName={listingName}
          onBack={() => setStep(1)}
          onFinalConfirm={handleContactDetailsSubmit}
        />
      );
    }
    if (step === 3 && selectedDate && selectedTime && contactDetails) {
      return <BookingPayment onPaymentSuccess={handlePaymentSuccess} />;
    }
    if (step === 4) {
      return (
        <div className="text-center p-8 bg-green-50 rounded-xl shadow-inner">
          <svg
            className="w-16 h-16 text-green-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0
               11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-3xl font-bold text-green-800 mb-2">
            Booking Complete!
          </h3>
          <p className="text-gray-600 mb-4">
            Your viewing for <strong>{listingName}</strong> is confirmed.
          </p>
          <p className="text-xl font-extrabold text-green-700">
            {selectedDate} at {selectedTime}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Check your email for the confirmation and calendar invite.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Return to Home
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-8 sm:p-12">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Schedule Viewing
        </h1>
        <p className="text-xl font-semibold text-green-600 mb-8">
          {listingName}
        </p>

        <ProgressBar currentStep={step} />
        {renderContent()}
      </div>
    </div>
  );
}

// --- Wrap with Sidebar Layout ---
export default function BookingPage() {
  const [activeMenu, setActiveMenu] = useState("Booking");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Booking Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <CompleteBookingSystem listingName="Luxury Apartment 3B" />
      </main>
    </div>
  );
}
