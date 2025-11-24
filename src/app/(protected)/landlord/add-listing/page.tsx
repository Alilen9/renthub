// src/app/(protected)/landlord/dashboard/add-listing/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    name: "",
    price: 0,
    description: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

  //   const { name, description, price, location, category, video_url } = req.body;
  // const landlord_id = req.user.id;
  // const image_urls = [];
    e.preventDefault();
    // Validate form
    if (!form.name.trim() || !form.price || form.price <= 0 || form.location) {
      toast.error("Product name and valid price are required.");
      return;
    }
    

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("price", form.price);
    
    formData.append("video_url", form.media);
    formData.append("image_url", form.media)
    formData.append("is_active", form.is_active.toString());

    
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
