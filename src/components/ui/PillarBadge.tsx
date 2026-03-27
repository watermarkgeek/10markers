import { cn } from "@/lib/utils";
import { PILLARS } from "@/data/markers";
import type { Pillar } from "@/data/markers";

interface PillarBadgeProps {
  pillar: Pillar;
  className?: string;
}

const pillarStyles: Record<Pillar, string> = {
  abiding: "bg-blue-50 text-blue-700 border border-blue-200",
  making: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  together: "bg-amber-50 text-amber-700 border border-amber-200",
};

export default function PillarBadge({ pillar, className }: PillarBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full",
        pillarStyles[pillar],
        className
      )}
    >
      {PILLARS[pillar].label}
    </span>
  );
}
