"use client";

import { STAGES, STAGE_LABELS, type Stage } from "@/types";
import { cn } from "@/lib/utils";

interface StageProgressBarProps {
  currentStage: Stage;
  completedStages: Stage[];
  className?: string;
}

export default function StageProgressBar({
  currentStage,
  completedStages,
  className,
}: StageProgressBarProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className={cn("flex items-center gap-1 px-4", className)}>
      {STAGES.map((stage, i) => {
        const isDone = completedStages.includes(stage);
        const isCurrent = stage === currentStage;

        return (
          <div key={stage} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn(
                "h-1.5 w-full rounded-full transition-all duration-500",
                isDone
                  ? "bg-[#28312f]"
                  : isCurrent
                  ? "bg-[#c8973a]"
                  : "bg-[#e8e2d9]"
              )}
            />
            <span
              className={cn(
                "text-[9px] font-medium uppercase tracking-wide",
                isDone
                  ? "text-[#28312f]"
                  : isCurrent
                  ? "text-[#c8973a]"
                  : "text-[#e8e2d9]"
              )}
            >
              {STAGE_LABELS[stage]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
