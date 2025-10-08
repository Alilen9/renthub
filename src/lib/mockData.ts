export type Listing = {
  id: string;
  title: string;
  location: string;
  price: number;
  verified: boolean;
  beds: string;
  area: string;
  description?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  type?: string;
  virtualTourUrl?: string;
  landlordId?: string;
  similarPropertyIds?: string[]; // ✅ Added
};

export const listings: Listing[] = [
  {
    id: "1",
    title: "2 Bedroom Apartment",
    location: "Westlands, Nairobi",
    price: 125000,
    verified: true,
    beds: "2 BR · 1 Bath",
    area: "125 m²",
    description:
      "Modern apartment with a 360° virtual tour, high-speed internet, 24/7 security, and close proximity to Sarit Centre.",
    coordinates: { lat: -1.268, lng: 36.811 },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
    ],
    virtualTourUrl: "https://myvirtualtours.com/apartment-2br-westlands",
    landlordId: "landlord-101",
    similarPropertyIds: ["4", "5"], // ✅ similar apartments in Nairobi
  },
  {
    id: "2",
    title: "1 Bedroom Studio",
    location: "Ruiru, Kiambu",
    price: 55000,
    verified: false,
    beds: "1 BR · 1 Bath",
    area: "80 m²",
    description:
      "Affordable studio perfect for students and young professionals. Walking distance to public transport and Ruiru Mall.",
    coordinates: { lat: -1.145, lng: 36.963 },
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
    virtualTourUrl: "https://myvirtualtours.com/studio-ruiru",
    landlordId: "landlord-102",
    similarPropertyIds: ["5"], // ✅ also affordable, small units
  },
  {
    id: "3",
    title: "3 Bedroom Townhouse",
    location: "Karen, Nairobi",
    price: 200000,
    verified: true,
    beds: "3 BR · 2 Bath",
    area: "250 m²",
    description:
      "Spacious townhouse featuring a private garden, ample parking, and serene neighborhood near Karen Blixen Museum.",
    coordinates: { lat: -1.333, lng: 36.717 },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4f7e50cf0c52?auto=format&fit=crop&w=800&q=80",
    ],
    virtualTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    landlordId: "landlord-103",
    similarPropertyIds: ["4"], // ✅ luxury properties nearby
  },
  {
    id: "4",
    title: "Luxury Penthouse",
    location: "Kilimani, Nairobi",
    price: 300000,
    verified: true,
    beds: "4 BR · 3 Bath",
    area: "400 m²",
    description:
      "Premium penthouse with rooftop pool, smart home features, and stunning Nairobi skyline views.",
    coordinates: { lat: -1.295, lng: 36.792 },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    ],
    virtualTourUrl: "https://myvirtualtours.com/penthouse-kilimani",
    landlordId: "landlord-104",
    similarPropertyIds: ["1", "3"], // ✅ luxury/high-end properties
  },
  {
    id: "5",
    title: "Serviced Apartment",
    location: "Upper Hill, Nairobi",
    price: 180000,
    verified: false,
    beds: "2 BR · 2 Bath",
    area: "150 m²",
    description:
      "Modern serviced apartment ideal for expats, close to major offices and hospitals in Upper Hill.",
    coordinates: { lat: -1.3, lng: 36.815 },
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4f7e50cf0c52?auto=format&fit=crop&w=800&q=80",
    ],
    virtualTourUrl: "https://myvirtualtours.com/serviced-upperhill",
    landlordId: "landlord-105",
    similarPropertyIds: ["1", "2"], // ✅ midrange properties
  },
];
