// src/components/tenants/BookingPaymentEscrow.tsx
"use client";

import { useState } from 'react';

type BookingPaymentEscrowProps = {
    date: string;
    time: string;
    listingName: string;
    // Assuming deposit amount is passed down from a parent or API
    depositAmount: number; 
    onBack: () => void;
    // Handler to proceed to the final step (Booking Confirmed)
    onPaymentSuccess: (details: { name: string, email: string }) => void; 
};

export default function BookingPaymentEscrow({ 
    date, 
    time, 
    listingName, 
    depositAmount = 500, // Default for demonstration
    onBack, 
    onPaymentSuccess 
}: BookingPaymentEscrowProps) {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cardDetails, setCardDetails] = useState(''); // Mock card input
    const [isProcessing, setIsProcessing] = useState(false);
    
    const effectiveDepositAmount = depositAmount || 500; 

    const isFormValid = name.trim() !== '' && 
                        email.trim().includes('@') && 
                        cardDetails.length >= 10; // Simple mock validation

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            setIsProcessing(true);
            
            // 🌟 INTEGRATION POINT: Escrow Transaction 🌟
            console.log(`INITIATING ESCROW: $${effectiveDepositAmount} for ${listingName} via Stripe Connect/Fintech.`);
            
            // Simulate API call to your backend, which triggers the escrow hold (e.g., Stripe Payment Intent)
            setTimeout(() => {
                setIsProcessing(false);
                // On successful escrow hold, proceed to the final confirmation step
                onPaymentSuccess({ name, email });
            }, 2500); // 2.5 seconds to simulate transaction time
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">
                3. Secure Deposit in Escrow 🔒
            </h3>

            {/* Booking Summary */}
            <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-gray-800">
                    Reserving: <span className="font-extrabold">{listingName}</span>
                </p>
                <p className="text-md text-gray-600 mt-1">
                    **Viewing:** {date} at {time}
                </p>
            </div>

            {/* Escrow Mechanism Explanation */}
            <div className='p-5 bg-yellow-50 border border-yellow-300 rounded-xl space-y-3'>
                <h4 className='text-lg font-bold text-yellow-800'>Escrow Deposit: Funds Held Securely</h4>
                <p className='text-sm text-gray-700'>
                    Your deposit of <span className='font-extrabold text-lg text-yellow-900'>${effectiveDepositAmount.toLocaleString()}</span> is held by a third-party payment partner (Escrow) and is **not** immediately released to the landlord.
                </p>
                <ul className='list-disc list-inside text-sm text-gray-600 ml-4'>
                    <li>**Protection:** Funds are only released after you confirm move-in.</li>
                    <li>**Refundable:** Fully refundable if the booking is canceled within policy.</li>
                </ul>
            </div>

            {/* Contact & Card Details */}
            <div className="space-y-4 pt-2">
                <h4 className='text-lg font-semibold text-gray-800'>Payment Details</h4>
                <label htmlFor="p_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    id="p_name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Name on Card/Receipt"
                />
                <label htmlFor="p_email" className="block text-sm font-medium text-gray-700">Email Address (for Receipt)</label>
                <input
                    id="p_email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="email@example.com"
                />
                
                {/* Mock Card Input */}
                <label htmlFor="p_card" className="block text-sm font-medium text-gray-700">Card Number (Mock)</label>
                <input
                    id="p_card"
                    type="text"
                    value={cardDetails}
                    onChange={(e) => setCardDetails(e.target.value)}
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition disabled:opacity-50"
                >
                    &larr; Back to Details
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid || isProcessing}
                    className={`flex-1 py-3 text-white rounded-lg font-bold transition duration-300 flex items-center justify-center ${
                        isFormValid && !isProcessing
                            ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Placing Hold...
                        </>
                    ) : (
                        `Pay $${effectiveDepositAmount.toLocaleString()} to Escrow`
                    )}
                </button>
            </div>
        </form>
    );
}