"use client";

import { useState } from "react";
import BookingCalendar from "@/components/tenants/BookingCalendar";
import BookingReview from "@/components/tenants/BookingReview";
import BookingPaymentEscrow from "@/components/tenants/BookingPaymentEscrow";
import BookingProgressBar from "@/components/tenants/BookingProgressBar";
import MoveInConfirmation from "@/components/tenants/MoveInConfirmation";
import TenantSidebar from "@/components/tenants/TenantSidebar";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [contactDetails, setContactDetails] = useState<{ name: string; email: string } | null>(null);

  const [activeMenu, setActiveMenu] = useState("Book a Viewing");
  const listingName = "Luxury Apartment 3B";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <TenantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} /> */}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Book a Viewing</h1>
        <p className="text-black font-semibold mb-6">{listingName}</p>

        <BookingProgressBar currentStep={step} />

        {step === 1 && (
          <BookingCalendar
            onSelect={(date: string, time: string) => {
              setSelectedDate(date);
              setSelectedTime(time);
              setStep(2);
            }}
          />
        )}

        {step === 2 && selectedDate && selectedTime && (
          <BookingReview
            date={selectedDate}
            time={selectedTime}
            listingName={listingName}
            onBack={() => setStep(1)}
            onFinalConfirm={(details) => {
              setContactDetails(details);
              setStep(3);
            }}
          />
        )}

        {step === 3 && selectedDate && selectedTime && contactDetails && (
          <BookingPaymentEscrow
            date={selectedDate}
            time={selectedTime}
            listingName={listingName}
            depositAmount={500}
            onBack={() => setStep(2)}
            onPaymentSuccess={() => setStep(4)}
          />
        )}

        {step === 4 && selectedDate && selectedTime && (
          <MoveInConfirmation
            date={selectedDate}
            time={selectedTime}
            listingName={listingName}
          />
        )}
      </div>
    </div>
  );
}
