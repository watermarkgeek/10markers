"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface XpPopupProps {
  xp: number;
  show: boolean;
  className?: string;
}

export default function XpPopup({ xp, show, className }: XpPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible || xp === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50",
        "bg-[#c8973a] text-white font-bold text-lg px-5 py-2 rounded-full shadow-lg",
        "animate-fade-up pointer-events-none",
        className
      )}
    >
      +{xp} XP ✨
    </div>
  );
}
