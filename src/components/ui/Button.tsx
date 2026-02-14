"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-semibold transition duration-200 focus:outline-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
