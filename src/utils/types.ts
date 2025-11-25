import { ListingFile } from "@/components/landlord/types";

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
  media: Array<{ url?: string; name?: string; type: "image" | "video" | "360"; size?: number }>;
  visibility?: "local" | "national" | "international";
  package?: "free" | "standard" | "premium";
};
