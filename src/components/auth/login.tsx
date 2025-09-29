"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({
  onForgot,
  onSignup,
}: {
  onForgot: () => void;
  onSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace with real login API
    if (role === "landlord") {
      router.push("/dashboard/landlord");
    } else {
      router.push("/tenant/dashboard"); // or homepage if you don’t have tenant dashboard yet
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-xl font-semibold text-black">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      {/* Role selection */}
      <div className="flex gap-4 text-black">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="tenant"
            checked={role === "tenant"}
            onChange={() => setRole("tenant")}
          />
          Tenant
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="landlord"
            checked={role === "landlord"}
            onChange={() => setRole("landlord")}
          />
          Landlord
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Login
      </button>

      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={onForgot}
          className="text-black hover:underline"
        >
          Forgot Password?
        </button>
        <button
          type="button"
          onClick={onSignup}
          className="text-black hover:underline"
        >
          New user? Sign Up
        </button>
      </div>
    </form>
  );
}
