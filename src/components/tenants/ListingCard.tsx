import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/lib/mockData";

export default function ListingCard({ listing }: { listing: Listing }) {
      
  return (
    <div className="border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden bg-white">
      {/* Property Image */}
      <div className="relative h-48 w-full">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover"
          priority={false}
        />
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {listing.verified && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              ✔ Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-gray-600 text-sm">{listing.location}</p>
        <p className="mt-2 text-red-600 font-bold">
          KES {listing.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">{listing.beds} · {listing.area}</p>

        {/* View Details */}
        <div className="mt-3">
          <Link
            href={`/tenant/listing/${listing.id}`}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
