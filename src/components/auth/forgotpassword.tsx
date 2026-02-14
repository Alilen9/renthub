"use client";

import { useState } from "react";

export default function ForgotPasswordForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: reset password logic
    alert("Password reset link sent!");
  };

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <h2 className="text-xl font-semibold">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button className="w-full py-2 bg-indigo-600 text-white rounded-lg">
        Send Reset Link
      </button>

      <p className="text-sm text-center">
        Remembered?{" "}
        <button type="button" onClick={onLogin} className="text-indigo-600 hover:underline">
          Back to Login
        </button>
      </p>
    </form>
  );
}
