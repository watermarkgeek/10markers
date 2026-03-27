"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          {
            // Sizes
            "text-sm px-4 py-2": size === "sm",
            "text-base px-6 py-3": size === "md",
            "text-lg px-8 py-4": size === "lg",
            // Variants
            "bg-[#1a2744] text-white hover:bg-[#243359] focus-visible:ring-[#1a2744]":
              variant === "primary",
            "bg-white text-[#1a2744] border-2 border-[#1a2744] hover:bg-[#f8f5f0] focus-visible:ring-[#1a2744]":
              variant === "secondary",
            "text-[#6b6b6b] hover:text-[#1a2744] hover:bg-[#f8f5f0] focus-visible:ring-[#1a2744]":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500":
              variant === "danger",
            "bg-[#c8973a] text-white hover:bg-[#b07a2e] focus-visible:ring-[#c8973a]":
              variant === "gold",
            "w-full": fullWidth,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
