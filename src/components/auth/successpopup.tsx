"use client";

import { useEffect } from "react";

export default function SuccessPopup({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2500); // auto return to login after 2.5s
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl">🎉</div>
      <h2 className="text-xl font-semibold">Account created successfully!</h2>
      <p className="text-gray-600">Redirecting you to login...</p>
    </div>
  );
}
