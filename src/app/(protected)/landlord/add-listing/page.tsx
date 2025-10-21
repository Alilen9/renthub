// src/app/(protected)/landlord/dashboard/add-listing/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingDraft } from "@/components/landlord/types";
import ListingDetailsForm from "@/components/landlord/ListingDetailsForm";
import ListingMediaSection from "@/components/landlord/ListingMediaSection";
import Button from "@/components/ui/Button";

export default function AddListingPage() {
  const router = useRouter();

  const [form, setForm] = useState<ListingDraft>({
    title: "",
    price: "",
    county: "",
    type: "",
    amenities: [],
    files: [],
    location: { lat: null, lng: null, address: "", county: "" },
    houseType: "",
    media: [],
  });

  const handleNext = () => {
    localStorage.setItem("listingDraft", JSON.stringify(form));
    router.push("/landlord/dashboard/payment");
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ListingDetailsForm form={form} setForm={setForm} />
        <ListingMediaSection form={form} setForm={setForm} onSubmit={handleNext} />
      </div>
    </div>
  );
}
