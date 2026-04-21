"use client";

import { useState, useEffect, useCallback } from "react";

const SAVED_KEY = "savedProperties";

export interface SavedPropertiesHook {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
}

export function useSavedProperties(): SavedPropertiesHook {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(SAVED_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedIds(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved properties:", e);
      }
    }
    setInitialized(true);
  }, []);

  // Persist to localStorage whenever savedIds changes
  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
    }
  }, [savedIds, initialized]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const clearAll = useCallback(() => {
    setSavedIds([]);
  }, []);

  return { savedIds, toggleSave, isSaved, clearAll };
}
