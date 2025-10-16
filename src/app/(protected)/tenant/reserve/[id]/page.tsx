// src/app/reserve/[id]/page.tsx
import PaymentOptions from "@/components/tenants/";
import { listings } from "@/lib/mockData";


export default function ReservePage({ params }: { params: { id: string } }) {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    return <p className="p-6 text-red-600">Listing not found.</p>;
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">💳 Reserve House via Escrow</h1>

      {/* Summary */}
      <div className="p-4 border rounded-xl bg-white shadow space-y-2">
        <h2 className="text-lg font-semibold">{listing.title}</h2>
        <p className="text-gray-600">{listing.location}</p>
        <p className="text-red-600 font-bold">
          Deposit: KES {(listing.price * 0.1).toLocaleString()} (10%)
        </p>
      </div>

      {/* Payment Options */}
      <PaymentOptions listingId={listing.id} amount={listing.price * 0.1} />
    </main>
  );
}
