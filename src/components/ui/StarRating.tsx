"use client";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  stars: number; // earned (0–3)
  total?: number; // max stars
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export default function StarRating({
  stars,
  total = 3,
  size = "md",
  animated = false,
  className,
}: StarRatingProps) {
  const sizeMap = { sm: "text-sm", md: "text-xl", lg: "text-3xl" };

  return (
    <div className={cn("flex gap-1 items-center", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            sizeMap[size],
            "transition-all",
            animated && i < stars ? "animate-star" : "",
            i < stars ? "opacity-100" : "opacity-20 grayscale"
          )}
          style={animated && i < stars ? { animationDelay: `${i * 0.15}s` } : undefined}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
