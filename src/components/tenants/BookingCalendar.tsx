"use client";

import { useState } from "react";

// Define the type for the availability object to allow dynamic string indexing
type Availability = Record<string, string[]>;

type BookingCalendarProps = {
    onSelect: (date: string, time: string) => void;
};

// MOCK DATA: Simulating available slots
const mockAvailability: Availability = {
    "2025-10-10": ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"],
    "2025-10-11": ["9:00 AM", "1:00 PM", "4:30 PM"],
    "2025-10-12": ["10:00 AM", "11:00 AM", "12:00 PM"], 
    "2025-10-13": ["2:00 PM", "3:00 PM"],
};

// Function to get time slots for a specific date
const getTimeSlotsForDate = (date: string): string[] => {
    return mockAvailability[date] || [];
};

// Helper function to format date input to match mock data keys (YYYY-MM-DD)
const formatDateKey = (dateString: string) => {
    // This assumes the input date format is already YYYY-MM-DD
    return dateString;
};

// Component to replace the browser's alert() function
const CustomAlertModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
            <h4 className="text-xl font-bold text-red-600">Action Required</h4>
            <p className="text-gray-700">{message}</p>
            <button
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-150"
            >
                Close
            </button>
        </div>
    </div>
);

// Main Booking Calendar Component
export default function BookingCalendar({ onSelect }: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const availableSlots: string[] = selectedDate ? getTimeSlotsForDate(formatDateKey(selectedDate)) : [];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        setSelectedTime(""); // Reset time selection when the date changes
    };

    const handleConfirm = () => {
        if (!selectedDate || !selectedTime) {
            setAlertMessage("Please select both a date and an available time slot.");
            return;
        }
        // Pass selection up to the parent wrapper
        onSelect(selectedDate, selectedTime);
    };

    // Determine min date (start from tomorrow)
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const tomorrowDate = today.toISOString().split('T')[0];

    return (
        <div className="p-0 space-y-6">
            {/* Render the Custom Alert Modal */}
            {alertMessage && (
                <CustomAlertModal
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}

            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center">
                <span className="mr-2 text-green-600">1.</span> Select Available Date & Time
            </h3>

            {/* Date Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Choose a Date (Viewings start tomorrow)</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={tomorrowDate} // Prevents booking for today/past
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-green-500 focus:border-green-500 transition duration-150 text-base"
                />
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
                    
                    {availableSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`px-5 py-2 rounded-lg text-base font-medium transition duration-150 border 
                                        ${selectedTime === slot
                                            ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-400'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="p-3 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 rounded text-sm">
                            Sorry, no slots are available for {selectedDate}. Please select another day.
                        </p>
                    )}
                    
                    <p className="text-xs text-gray-500 pt-1">All slots are 30-minute private viewings.</p>
                </div>
            )}

            {/* Confirmation Button */}
            <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                className={`w-full text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 text-lg ${
                    selectedDate && selectedTime 
                        ? 'bg-green-600 hover:bg-green-700 shadow-xl' 
                        : 'bg-gray-400 cursor-not-allowed opacity-70'
                }`}
            >
                Proceed to Contact Details & Review
            </button>
        </div>
    );
}
