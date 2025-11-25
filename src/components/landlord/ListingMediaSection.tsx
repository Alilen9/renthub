"use client";

import React from "react";
import Button from "../ui/Button";
import FileUploader from "../upload/FileUploader";
import { ListingDraft, ListingFile } from "./types";
import PackageSelector from "../package/PackageSelector";

export default function ListingMediaSection({
  form,
  setForm,
  onSubmit,
}: {
  form: ListingDraft;
  setForm: React.Dispatch<React.SetStateAction<ListingDraft>>;
  onSubmit: () => void;
}) {
  const selectedPackage =
    (form.package as "free" | "standard" | "premium") || "free";

  // ✅ Corrected file type handling with strict typing
  const handleFilesSelected = (files: (File | ListingFile)[]) => {
    const media: ListingFile[] = files.map((file) => {
      if (file instanceof File) {
        // Determine valid file type
        let fileType: "video" | "image" | "360" = "image";
        if (file.type.startsWith("video")) fileType = "video";
        // You can optionally detect "360" by filename if needed

        return {
          url: URL.createObjectURL(file),
          name: file.name,
          type: fileType,
          size: file.size,
        };
      } else {
        // Ensure already structured ListingFile matches correct type
        const validType: "video" | "image" | "360" =
          file.type === "video" || file.type === "360" ? file.type : "image";
        return { ...file, type: validType };
      }
    });

    // ✅ Update form state safely
    setForm((prev: ListingDraft): ListingDraft => ({
      ...prev,
      files: files.filter((f): f is File => f instanceof File),
      media: media,
    }));
  };

  return (
    <div className="flex-1 space-y-4">
      <FileUploader
        onFilesSelected={handleFilesSelected}
        selectedFiles={form.files}
      />

      <PackageSelector
        selected={selectedPackage}
        onChange={(pkg: any) =>
          setForm((prev) => ({
            ...prev,
            package: pkg,
          }))
        }
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
