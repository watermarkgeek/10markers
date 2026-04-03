"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  color?: "navy" | "blue" | "green" | "amber";
  height?: "sm" | "md";
  className?: string;
  animated?: boolean;
}

const colorMap = {
  navy: "bg-[#28312f]",
  blue: "bg-[#3b6fa0]",
  green: "bg-[#2e7d5e]",
  amber: "bg-[#b07a2e]",
};

export default function ProgressBar({
  value,
  color = "navy",
  height = "md",
  className,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "w-full bg-[#e8e2d9] rounded-full overflow-hidden",
        height === "sm" ? "h-1.5" : "h-2.5",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          colorMap[color],
          "h-full rounded-full transition-all duration-700 ease-out"
        )}
        style={{
          width: `${clamped}%`,
          animation: animated ? "fillBar 0.8s ease-out" : undefined,
        }}
      />
    </div>
  );
}
