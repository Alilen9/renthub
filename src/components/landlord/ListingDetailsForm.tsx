"use client";
import React from "react";
import { ListingDraft } from "./types";
import LocationPicker from "../map/LocationPicker";
import Input from "../ui/Input";


export default function ListingDetailsForm({
  form,
  setForm,
}: {
  form: ListingDraft;
  setForm: React.Dispatch<React.SetStateAction<ListingDraft>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "price" ? Number(value) || "" : value }));
  };

  return (
    <div className="flex-1 space-y-4">
      <Input label="Title" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Spacious 2BR Apartment" />
      <Input label="Price (Ksh)" name="price" type="number" value={form.price} onChange={handleChange} placeholder="25000" />
      <Input label="County" name="county" value={form.county} onChange={handleChange} placeholder="Nairobi" />

      <div>
        <label className="text-sm font-medium">House type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-red-500 focus:ring-red-500"
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
        onChange={(e) => setForm({ ...form, amenities: e.target.value.split(",").map(a => a.trim()) })}
      />

      <LocationPicker onSelect={(loc) => setForm({ ...form, location: loc })} />
    </div>
  );
}
