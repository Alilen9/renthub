"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Listing } from "@/lib/mockData";

// ✅ Dynamically import react-leaflet components (client only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function PropertyMap({ listings }: { listings: Listing[] }) {
  useEffect(() => {
    // ✅ Import Leaflet only in browser
    (async () => {
      const L = await import("leaflet");

      const DefaultIcon = L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    })();
  }, []);

  // Center map (use first listing or fallback to Nairobi)
  const center = listings.length
    ? [listings[0].coordinates.lat, listings[0].coordinates.lng]
    : [-1.286389, 36.817223]; // Nairobi

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border shadow-md">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Base Map Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Property Markers */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.coordinates.lat, listing.coordinates.lng]}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{listing.title}</h3>
                <p>{listing.location}</p>
                <p className="text-sm text-gray-600">KES {listing.price}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
