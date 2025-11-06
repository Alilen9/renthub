"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ListingDraft } from "@/components/landlord/types";
import ListingDetailsForm from "@/components/landlord/ListingDetailsForm";
import ListingMediaSection from "@/components/landlord/ListingMediaSection";

export default function AddListingPage() {
  const router = useRouter();

  const [form, setForm] = useState<ListingDraft>({
    title: "",
    price: "",
    county: "",
    type: "",
    amenities: [],
    package: "free",
    files: [],
    location: { lat: null, lng: null, address: "", county: "" },
    houseType: "",
    media: [],
  });

  const [freeCount, setFreeCount] = useState(0);

  useEffect(() => {
    const count = Number(localStorage.getItem("freeListingCount") || 0);
    setFreeCount(count);
  }, []);

  // ✅ Main handler
  const handleNext = () => {
    if (form.package === "free") {
      if (freeCount < 5) { // ✅ Increased free limit from 2 → 5
        const savedListings = JSON.parse(localStorage.getItem("listings") || "[]");
        savedListings.push(form);
        localStorage.setItem("listings", JSON.stringify(savedListings));

        const newCount = freeCount + 1;
        localStorage.setItem("freeListingCount", newCount.toString());
        setFreeCount(newCount);

        alert("✅ Free listing published!");
      } else {
        alert(
          "⚠ You have reached the 5 free listings limit. Please choose a paid package."
        );
      }
    } else {
      // ✅ Paid package → save draft and redirect to payment page
      localStorage.setItem("listingDraft", JSON.stringify(form));
      router.push("/landlord/payment"); // Correct payment path
    }
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
