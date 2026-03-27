"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "navy" | "gold" | "ghost" | "danger";
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
          // Base — matches Watermark .btn pattern
          "inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          "rounded-xl",   /* --rounded-lg = 12px */

          // Sizes — letter-spacing tightened for Proxima Nova
          {
            "text-sm px-4 py-2 tracking-wide":    size === "sm",
            "text-base px-6 py-3 tracking-wide":  size === "md",
            "text-lg px-8 py-4 tracking-normal":  size === "lg",
          },

          // Variants — Tangerine orange is Watermark's primary CTA colour
          {
            // Primary → Tangerine orange (#ee7625)
            "bg-[#ee7625] text-white hover:bg-[#cc6118] active:bg-[#cc6118] focus-visible:ring-[#ee7625]":
              variant === "primary",

            // Secondary → Midnight outline
            "bg-white text-[#1a2744] border-2 border-[#1a2744] hover:bg-[#f8f5f0] focus-visible:ring-[#1a2744]":
              variant === "secondary",

            // Navy → solid Midnight (for use on dark hero backgrounds reversed)
            "bg-[#1a2744] text-white hover:bg-[#243359] focus-visible:ring-[#1a2744]":
              variant === "navy",

            // Gold → warm accent
            "bg-[#c8973a] text-white hover:bg-[#b07a2e] focus-visible:ring-[#c8973a]":
              variant === "gold",

            // Ghost → text only
            "text-[#787878] hover:text-[#1a2744] hover:bg-[#f8f5f0] focus-visible:ring-[#1a2744]":
              variant === "ghost",

            // Danger → red destructive
            "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500":
              variant === "danger",

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
