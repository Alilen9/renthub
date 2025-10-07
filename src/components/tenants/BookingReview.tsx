// src/components/BookingReview.tsx
"use client";

import { useState } from 'react';

type BookingReviewProps = {
    date: string;
    time: string;
    listingName: string;
    onBack: () => void;
    onFinalConfirm: (details: { name: string, email: string }) => void;
};

export default function BookingReview({ date, time, listingName, onBack, onFinalConfirm }: BookingReviewProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const isFormValid = name.trim() !== '' && email.trim() !== '' && email.includes('@');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onFinalConfirm({ name, email });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">
                3. Review & Complete Booking
            </h3>

            {/* Confirmation Summary Card */}
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-green-800">
                    Viewing for {listingName}
                </p>
                <p className="text-md text-gray-700 mt-1">
                    **Date:** {date} <br />
                    **Time:** {time}
                </p>
            </div>

            {/* Contact Details Form */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your Full Name"
                />
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="name@example.com"
                />
                <p className="text-xs text-gray-500 pt-1">A calendar invite will be sent to this email.</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                    &larr; Back to Time
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`flex-1 py-3 text-white rounded-lg font-bold transition duration-300 ${
                        isFormValid
                            ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Confirm & Book Now
                </button>
            </div>
        </form>
    );
}