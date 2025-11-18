"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import { toast } from "react-hot-toast";

// Define roles centrally
type Role = "tenant" | "landlord" | "serviceProvider";

export default function LoginForm({
  onForgot,
  onSignup,
}: {
  onForgot: () => void;
  onSignup: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("tenant");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Map roles to correct App Router URLs
  const roleRoutes: Record<Role, string> = {
    tenant: "/tenant/dashboard",
    landlord: "/landlord/dashboard",
    serviceProvider: "/spn/dashboard", // correct App Router path
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password }, role);

      toast.success("Logged in successfully!");

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      router.push(roleRoutes[role]);
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
        required
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      {/* Role selection */}
      <div className="flex gap-4 text-black">
        {[
          { value: "tenant", label: "Tenant" },
          { value: "landlord", label: "Landlord" },
          { value: "serviceProvider", label: "Service Provider" },
        ].map((r) => (
          <label key={r.value} className="flex items-center gap-2">
            <input
              type="radio"
              value={r.value}
              checked={role === r.value}
              onChange={(e) => setRole(e.target.value as Role)}
              className="accent-indigo-600"
            />
            {r.label}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full button-primary py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : "Login"}
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
