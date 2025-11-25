"use client";
import React from "react";

import Button from "../ui/Button";
import FileUploader from "../upload/FileUploader";
import { ListingDraft } from "./types";
import PackageSelector from "../package/PackageSelector";

export default function ListingMediaSection({
  form,
  setForm,
  onSubmit,
}: {
  form: ListingDraft & { isSubmitting?: boolean }; // Allow passing isSubmitting state
  setForm: React.Dispatch<React.SetStateAction<ListingDraft>>;
  onSubmit: () => void;
}) {
  // fallback to "free" if undefined
const selectedPackage = (form.package as "free" | "standard" | "premium") || "free";


  return (
    <div className="flex-1 space-y-4">
      <FileUploader
        onFilesSelected={(files) => setForm((prev) => ({ ...prev, new_files: files }))}
        selectedFiles={form.new_files || []}
      />

      <PackageSelector
        selected={selectedPackage}
        onChange={(pkg: any) => setForm((prev) => ({ ...prev, package: pkg }))}
      />

      <Button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-rose-600 to-indigo-700 text-white transition-colors py-3 font-semibold text-lg rounded-lg"
      >
        Publish Listing
      </Button>
    </div>
  );
}
