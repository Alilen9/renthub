// src/components/landlord/CreateListingModal.tsx
"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import FileUploader from "../upload/FileUploader";
import LocationPicker from "../map/LocationPicker";
import { ListingDraft } from "./types";
import PackageSelector from "../package/PackageSelector";
import PaymentModal from "../ui/paymentmodel";
// ✅ Fixed case-sensitive import


export default function CreateListingModal({
  open,
  onClose,
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  onPublish: (listing: ListingDraft) => void;
}) {
  const [form, setForm] = useState<ListingDraft>({
    title: "",
    price: "", // ✅ allow empty string (matches type)
    county: "",
    type: "",
    amenities: [],
    package: "free",
    files: [], // ✅ (File | ListingFile)[]
    location: { lat: null, lng: null, address: "", county: "" },
    houseType: "",
    media: [],
  });

  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setForm({ ...form, price: value === "" ? "" : Number(value) });
    } else if (name === "amenities") {
      setForm({ ...form, amenities: value.split(",").map((a) => a.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (form.package === "free") {
      console.log("Publishing free listing:", form);
      onPublish(form);
      onClose();
    } else {
      setShowPayment(true);
    }
  };

  return (
    <>
      <Modal isOpen={open} onClose={onClose} title="Create Listing">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Listing Details */}
          <div className="flex-1 space-y-4 text-black">
            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Spacious 2BR Apartment"
            />

            <Input
              label="Price (Ksh)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 25000"
            />

            <Input
              label="County"
              name="county"
              value={form.county}
              onChange={handleChange}
              placeholder="e.g. Nairobi"
            />

            <div>
              <label className="text-sm font-medium text-black">
                House type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-red-500 focus:ring-red-500 text-black"
              >
                <option value="">Select</option>
                <option value="apartment">Apartment</option>
                <option value="bedsitter">Bedsitter</option>
                <option value="bungalow">Bungalow</option>
                <option value="mansion">Mansion</option>
              </select>
            </div>

            <Input
              label="Amenities (comma separated)"
              name="amenities"
              value={form.amenities.join(", ")}
              onChange={handleChange}
              placeholder="e.g. WiFi, Parking, Water"
            />

            <LocationPicker
              onSelect={(loc) => setForm({ ...form, location: loc })}
            />
          </div>

          {/* Right Column: Media & Package */}
          <div className="flex-1 space-y-4 text-black">
            <FileUploader
              onFilesSelected={(files) =>
                setForm((prev) => ({ ...prev, files }))
              }
              selectedFiles={form.files}
            />

            <PackageSelector
              selected={form.package ?? "free"}
              onChange={(pkg) =>
                setForm({
                  ...form,
                  package: pkg as "free" | "standard" | "premium",
                })
              }
            />

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-rose-600 to-indigo-700 text-white transition-colors py-3 font-semibold text-lg rounded-lg"
              >
                {form.package === "free" && "Publish (Free)"}
                {form.package === "standard" && "Publish (Standard)"}
                {form.package === "premium" && "Publish (Premium)"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={form.package === "standard" ? 1000 : 2000}
        onSuccess={() => {
          console.log("Payment successful, publishing listing:", form);
          onPublish(form);
          setShowPayment(false);
          onClose();
        }}
      />
    </>
  );
}
