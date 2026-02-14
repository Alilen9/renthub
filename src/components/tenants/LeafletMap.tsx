"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Listing } from "@/lib/mockData";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// ✅ Define props type
type LeafletMapProps = {
  listings: Listing[];
};

export default function LeafletMap({ listings }: LeafletMapProps) {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]} // Nairobi center
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.coordinates.lat, listing.coordinates.lng]}
          icon={customIcon}
        >
          <Popup>
            <strong>{listing.title}</strong>
            <br />
            {listing.location} – Ksh {listing.price.toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
