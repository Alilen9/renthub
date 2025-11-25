// src/components/landlord/types.ts

export type ListingDraft = {
  name: string;
  price: number;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
    county: string;
  };
  description: string;
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
