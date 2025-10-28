"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

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
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setIsLoading(true);
    

    try {
      const result = await login({ email, password }, role);

      if (result.error) {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      } else {
        toast.success('Login successful!');
      }

      console.log("Login result", result)

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
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="tenant"
            checked={role === "tenant"}
            onChange={(e) => setRole(e.target.value as "tenant" | "landlord")}
          />
          Tenant
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="landlord"
            checked={role === "landlord"}
            onChange={(e) => setRole(e.target.value as "tenant" | "landlord")}
          />
          Landlord
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full button-primary py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Login'}
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
