"use client";

import ListingDetailsForm from "@/components/landlord/ListingDetailsForm";
import ListingMediaSection from "@/components/landlord/ListingMediaSection";
import { ListingDraft } from "@/components/landlord/types";
import Modal from "@/components/ui/Modal";
import PaymentModal from "@/components/ui/paymentmodel";
import { useState } from "react";


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

  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = () => {
    if (form.package === "free") {
      onPublish(form);
      onClose();
    } else {
      setShowPayment(true);
    }
  };

  return (
    <>
      <Modal isOpen={open} onClose={onClose} title="Create Listing">
        <div className="flex flex-col md:flex-row gap-8 text-black">
          <ListingDetailsForm form={form} setForm={setForm} />
          <ListingMediaSection form={form} setForm={setForm} onSubmit={handleSubmit} />
        </div>
      </Modal>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={form.package === "standard" ? 1000 : 2000}
        onSuccess={() => {
          onPublish(form);
          setShowPayment(false);
          onClose();
        }}
      />
    </>
  );
}
