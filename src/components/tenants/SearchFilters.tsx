// src/components/tenants/SearchFilters.tsx
"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export type Filters = {
  location: string;
  budget: number | "";
  type: string;
  verifiedOnly: boolean;
};

export default function SearchFilters({
  onChange,
}: {
  onChange: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    budget: "",
    type: "",
    verifiedOnly: false,
  });

  const [open, setOpen] = useState(true);

  const updateFilters = (field: keyof Filters, value: Filters[keyof Filters]) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onChange(updated);
  };

  const clearFilter = (field: keyof Filters) => {
    updateFilters(
      field,
      field === "budget" ? "" : field === "verifiedOnly" ? false : ""
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 text-sm max-w-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 rounded-t-xl"
      >
        <span>🔍 Filters</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* Animated Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Location */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ruiru"
                  value={filters.location}
                  onChange={(e) => updateFilters("location", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Budget (KES)
                </label>
                <input
                  type="number"
                  placeholder="Max budget"
                  value={filters.budget}
                  onChange={(e) =>
                    updateFilters(
                      "budget",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilters("type", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-800 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="">Any</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="House">House</option>
                </select>
              </div>

              {/* Verified Only */}
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) =>
                    updateFilters("verifiedOnly", e.target.checked)
                  }
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-xs">Verified Only</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        {filters.location && (
          <span
            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs cursor-pointer"
            onClick={() => clearFilter("location")}
          >
            {filters.location} ✕
          </span>
        )}
        {filters.budget && (
          <span
            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs cursor-pointer"
            onClick={() => clearFilter("budget")}
          >
            Budget: {filters.budget} ✕
          </span>
        )}
        {filters.type && (
          <span
            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs cursor-pointer"
            onClick={() => clearFilter("type")}
          >
            {filters.type} ✕
          </span>
        )}
        {filters.verifiedOnly && (
          <span
            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs cursor-pointer"
            onClick={() => clearFilter("verifiedOnly")}
          >
            Verified ✕
          </span>
        )}
        {!filters.location &&
          !filters.budget &&
          !filters.type &&
          !filters.verifiedOnly && (
            <span className="text-xs text-gray-400">No filters applied</span>
          )}
      </div>
    </div>
  );
}
