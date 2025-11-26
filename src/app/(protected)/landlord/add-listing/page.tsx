"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ListingDraft } from "@/components/landlord/types";
import ListingDetailsForm from "@/components/landlord/ListingDetailsForm";
import ListingMediaSection from "@/components/landlord/ListingMediaSection";
import toast from "react-hot-toast";
import { Apartment } from "@/utils";
import { createListing } from "@/services/houseService";

export default function AddListingPage() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Apartment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const [form, setForm] = useState<ListingDraft>({
    title: "",
    price: 0,
    county: "",
    type: "",
    amenities: [],
    files: [],
    location: { lat: null, lng: null, address: "", county: "" },
    houseType: "",
    media: [],
    is_active: true, // Default to active
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

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // Validate form
    if (!form.title.trim()) {
      toast.error("Listing title is required.");
      return;
    }
    if (!form.price || form.price <= 0) {
      toast.error("A valid price is required.");
      return;
    }
    if (!form.location.address) {
      toast.error("A location address is required.");
      return;
    }
    

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.title.trim()); // The backend expects 'name'
    formData.append("category", form.houseType);
    formData.append("description", ""); // Assuming description comes from somewhere else or is optional
    formData.append("location", form.location.address);
    formData.append("price", form.price.toString());
    formData.append("amenities", JSON.stringify(form.amenities));
    
    
    formData.append("is_active", form.is_active.toString() || 'true');

    
    
    try {
      const newProduct = await createListing(formData);
      
      if (newProduct.id) {
        toast.success("Product added successfully!");
        //fetchProducts(); // Refresh the product list
        
        // Reset and close form
        //setShowForm(false);
        // setForm({ 
        //   name: "", 
        //   price: 0,  
        //   description: "",
        //   is_active: true
        // });
        

      }
    } catch (error) {
      toast.error(error instanceof Error ? `Error: ${error.message}` : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ListingDetailsForm form={form} setForm={setForm} />
        <ListingMediaSection form={form} setForm={setForm} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
