// src/components/tenants/BookingProgressBar.tsx
"use client";

type BookingProgressBarProps = {
  currentStep: number;
};

export default function BookingProgressBar({ currentStep }: BookingProgressBarProps) {
  const steps = [
    { id: 1, label: "Select Date & Time" },
    { id: 2, label: "Contact Details" },
    { id: 3, label: "Payment" },
    { id: 4, label: "Booking Confirmed" },
  ];

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white transition-colors ${
              currentStep >= step.id ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            {step.id}
          </div>
          <p
            className={`text-xs mt-2 text-center ${
              currentStep >= step.id ? "text-green-700 font-semibold" : "text-gray-500"
            }`}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
