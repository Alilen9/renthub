// src/components/landlord/types.ts

// src/components/landlord/types.ts

export type ListingFile = {
  id?: string;          // present if file is saved on server
  url?: string;         // server URL after upload
  previewUrl?: string;  // local preview before upload
  name: string;
  type: "image" | "video" | "360"; // ✅ restrict to valid media types
  size?: number;
};


export type ListingDraft = {
  id?: string; 
  county: string | number | readonly string[] | undefined;
  type: string | number | readonly string[] | undefined;
  files: (File | ListingFile)[];  // ✅ unified here
  title: string;
  price: number | "";
  location: { lat: number | null; lng: number | null; address?: string; county?: string };
  houseType: string;
  amenities: string[];
  video_url?: string;
  is_active?: boolean;
  // Fields for handling images during edit
  existing_image_urls?: string[]; // URLs of images already on the server
  new_files?: File[]; // New files selected for upload
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
  image_urls?: string[];
}
