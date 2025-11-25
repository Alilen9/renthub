"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import { CheckCircle, CreditCard, Smartphone } from "lucide-react";

interface ListingDraft {
  title: string;
  package: string;
  location?: { address?: string };
}

export default function PaymentPage() {
  const [listing, setListing] = useState<ListingDraft | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [method, setMethod] = useState<"mpesa" | "bank" | null>(null);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load listing draft from localStorage
  useEffect(() => {
    setTimeout(() => {
      const draft = localStorage.getItem("listingDraft");
      if (draft) setListing(JSON.parse(draft));
      setLoading(false);
    }, 800); // small delay for UX
  }, []);

  const amount =
    listing?.package === "standard"
      ? 1000
      : listing?.package === "premium"
      ? 2000
      : 0;

  // Generate PDF receipt
  const generateReceiptPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tunyce Real Estate - Payment Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transactionId}`, 20, 40);
    doc.text(`Listing Title: ${listing?.title || "N/A"}`, 20, 50);
    doc.text(`Package: ${listing?.package || "N/A"}`, 20, 60);
    doc.text(
      `Payment Method: ${method === "mpesa" ? "M-Pesa" : "Bank Transfer"}`,
      20,
      70
    );
    doc.text(`Amount: Ksh ${amount.toLocaleString()}`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);
    doc.text("Thank you for your payment!", 20, 110);
    doc.save(`Receipt_${transactionId}.pdf`);
  };

  // Handle payment simulation
  const handlePayment = () => {
    if (!method) return toast.error("Please select a payment method");
    if (method === "mpesa" && mpesaNumber.trim() === "")
      return toast.error("Enter your M-Pesa number");

    const txId = "TX" + Math.floor(Math.random() * 10000000);
    setTransactionId(txId);

    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    payments.push({
      id: txId,
      listingTitle: listing?.title,
      amount,
      method,
      date: new Date().toISOString(),
    });
    localStorage.setItem("payments", JSON.stringify(payments));

    const savedListings = JSON.parse(localStorage.getItem("listings") || "[]");
    if (listing) savedListings.push(listing);
    localStorage.setItem("listings", JSON.stringify(savedListings));
    localStorage.removeItem("listingDraft");

    setShowReceipt(true);
    toast.success("Payment successful! Your listing is now published.");
  };

  const handleDone = () => {
    router.push("/landlord/dashboard/properties");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading payment details...
        </p>
      </div>
    );
  }

  // If no draft found
  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg mb-3">
          No listing found. Please create a listing first.
        </p>
      <button
  onClick={() => router.push("/landlord/property")}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  GO TO PROPERTIES
</button>

      </div>
    );
  }

  // Main Payment Page
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#58181C]">
          Secure Payment
        </h1>
        <p className="text-gray-600">
          Complete your payment to publish your property listing.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        {!showReceipt ? (
          <>
            {/* Summary Card */}
            <div className="mb-6 bg-[#F4C542]/10 border-l-4 border-[#F4C542] p-4 rounded-xl">
              <h2 className="font-semibold text-[#58181C] mb-2">
                Payment Summary
              </h2>
              <p className="text-gray-600">
                <strong>Title:</strong> {listing.title}
              </p>
              <p className="text-gray-600 capitalize">
                <strong>Package:</strong> {listing.package}
              </p>
              <p className="text-gray-600">
                <strong>Location:</strong>{" "}
                {listing.location?.address || "Not specified"}
              </p>
              <p className="text-[#C81E1E] font-bold mt-2 text-lg">
                Amount: Ksh {amount.toLocaleString()}
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Choose Payment Method
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setMethod("mpesa")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition ${
                    method === "mpesa"
                      ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                      : "bg-gray-50 border-gray-300 hover:border-green-300"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  M-Pesa
                </button>

                <button
                  onClick={() => setMethod("bank")}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition ${
                    method === "bank"
                      ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                      : "bg-gray-50 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Bank
                </button>
              </div>
            </div>

            {/* Mpesa Input */}
            {method === "mpesa" && (
              <div className="mb-6">
                <label className="text-sm text-gray-700 mb-2 block">
                  Enter M-Pesa Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0712 345 678"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring focus:ring-green-200 outline-none"
                />
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              className="w-full py-3 bg-gradient-to-r from-[#C81E1E] to-[#58181C] text-white font-semibold rounded-xl hover:opacity-90 transition"
            >
              Pay Ksh {amount.toLocaleString()}
            </button>
          </>
        ) : (
          <>
            {/* Success Section */}
            <div className="text-center">
              <CheckCircle className="text-green-600 w-14 h-14 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-[#58181C] mb-2">
                Payment Successful 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your listing <strong>{listing.title}</strong> is now published.
              </p>

              <div className="bg-gray-50 p-5 rounded-xl border mb-6 text-left">
                <h3 className="font-semibold text-[#58181C] mb-3">
                  Payment Receipt
                </h3>
                <div className="text-gray-700 space-y-1">
                  <p>
                    <strong>Transaction ID:</strong> {transactionId}
                  </p>
                  <p>
                    <strong>Method:</strong>{" "}
                    {method === "mpesa" ? "M-Pesa" : "Bank Transfer"}
                  </p>
                  <p>
                    <strong>Amount:</strong> Ksh {amount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date().toLocaleDateString("en-KE")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={generateReceiptPDF}
                  className="w-full py-3 bg-[#F4C542] text-[#58181C] font-semibold rounded-xl hover:bg-[#e3b838] transition"
                >
                  Download Receipt (PDF)
                </button>

                <button
                 
                  className="w-full py-3 bg-[#58181C] text-white font-semibold rounded-xl hover:bg-[#3c0f12] transition"
                >
                   GO TO PROPERTIES
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
