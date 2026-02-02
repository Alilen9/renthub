"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import FileUploader from "../upload/FileUploader";
import { ListingDraft, ListingFile } from "./types";
import PackageSelector from "../package/PackageSelector";

export default function ListingMediaSection({
  form,
  setForm,
  onSubmit,
  isSubmitting,
}: {
  form: ListingDraft;
  setForm: React.Dispatch<React.SetStateAction<ListingDraft>>;
  onSubmit: () => void;
  isSubmitting: boolean;
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
    <div className="flex-1 space-y-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Media & Publishing</h3>
        <p className="text-sm text-gray-500 mb-4">Upload images and select a promotion package.</p>
      <FileUploader
        onFilesSelected={handleFilesSelected}
        selectedFiles={form.files}
      />
      </div>

      <div className="pt-4 border-t border-gray-100">
      <PackageSelector
        selected={selectedPackage}
        onChange={(pkg: string) =>
          setForm((prev) => ({
            ...prev,
            package: pkg as "free" | "standard" | "premium",
          }))
        }
      />
      </div>

      <div className="pt-4">
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-rose-600 to-indigo-700 text-white transition-all hover:shadow-lg hover:scale-[1.02] py-3 font-semibold text-lg rounded-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Publishing...
          </span>
        ) : (
          "Publish Listing"
        )}
      </Button>
      </div>
    </div>
  );
}
