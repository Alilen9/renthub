// src/components/landlord/types.ts

export type ListingFile = {
  id?: string;          // present if file is saved on server
  url?: string;         // server URL after upload
  previewUrl?: string;  // local preview before upload
  name: string;
  type: string;
};

export type ListingDraft = {
  county: string | number | readonly string[] | undefined;
  type: string | number | readonly string[] | undefined;
  files: (File | ListingFile)[];  // ✅ unified here
  title: string;
  price: number | "";
  location: { lat: number | null; lng: number | null; address?: string; county?: string };
  houseType: string;
  amenities: string[];
  media: Array<{ url?: string; name?: string; type: "image" | "video" | "360"; size?: number }>;
  visibility?: "local" | "national" | "international";
  package?: "free" | "standard" | "premium";
};

export type Message = {
  id: string;
  from: string;
  body: string;
  time: string;
};

export interface Listing {
  title: string;
  description: string;
  price: string;
  location: string;
  files?: (File | ListingFile)[];
}
