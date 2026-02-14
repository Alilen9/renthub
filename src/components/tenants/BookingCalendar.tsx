// src/components/tenants/BookingCalendar.tsx
"use client";

import { useState } from "react";

type BookingCalendarProps = {
  onSelect: (date: string, time: string) => void;
};

const mockAvailability: Record<string, string[]> = {
  "2025-11-14": ["10:00 AM", "1:00 PM", "3:00 PM"],
  "2025-11-15": ["11:00 AM", "2:00 PM"],
};

export default function BookingCalendar({ onSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const getTimeSlots = (date: string) =>
    mockAvailability[date] || ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  const slots = selectedDate ? getTimeSlots(selectedDate) : [];

  return (
    <div className="space-y-5">
      <label className="block font-medium text-black">Select a Date</label>
      <input
        type="date"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-green-500 focus:border-green-500"
        min={new Date().toISOString().split("T")[0]}
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate && (
        <>
          <label className="block font-medium text-black mt-3">Select Time Slot</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`py-2 rounded-lg border font-semibold transition ${
                  selectedTime === slot
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-black"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        disabled={!selectedDate || !selectedTime}
        onClick={() => onSelect(selectedDate, selectedTime)}
        className={`w-full py-3 mt-4 rounded-lg font-semibold text-white transition ${
          selectedDate && selectedTime
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
