"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ListingDraft } from "./types";
import ListingDetailsForm from "./ListingDetailsForm";
import ListingMediaSection from "./ListingMediaSection";
import PaymentModal from "../ui/paymentmodel";


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
