"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { MARKERS, PILLARS } from "@/data/markers";
import type { Pillar } from "@/data/markers";

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; text: string; dot: string }> = {
  abiding: {
    bg: "bg-[#eef6f9]",
    border: "border-[#2e6e84]",
    text: "text-[#2e6e84]",
    dot: "bg-[#2e6e84]",
  },
  making: {
    bg: "bg-[#eef7f2]",
    border: "border-[#2e7d5e]",
    text: "text-[#2e7d5e]",
    dot: "bg-[#2e7d5e]",
  },
  enjoying: {
    bg: "bg-[#fdf6ed]",
    border: "border-[#b07a2e]",
    text: "text-[#b07a2e]",
    dot: "bg-[#b07a2e]",
  },
};

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

export default function MarkersLearnPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="Phase 2: The Markers" showBack backHref="/learn/vision/complete" showProfile={false} />

      <div className="px-5 pt-5 pb-4">
        <p
          className="text-2xl font-bold text-[#28312f] mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          10 Markers of a Biblical Church
        </p>
        <p className="text-sm text-[#6b6b6b]">
          Learn each marker name grouped by its pillar. Tap "Start Flashcards" when you feel ready.
        </p>
      </div>

      <div className="flex-1 px-5 pb-6 space-y-5 overflow-y-auto">
        {PILLARS_ORDER.map((pillar, pillarIdx) => {
          const pillarInfo = PILLARS[pillar];
          const style = PILLAR_STYLES[pillar];
          const markers = MARKERS.filter((m) => m.pillar === pillar);

          return (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pillarIdx * 0.12, duration: 0.4 }}
              className={`rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden`}
            >
              {/* Pillar header */}
              <div className="px-4 py-3 border-b border-current border-opacity-20">
                <p className={`text-xs uppercase tracking-widest font-bold ${style.text}`}>
                  Pillar {pillarIdx + 1}
                </p>
                <p
                  className={`text-base font-bold ${style.text}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pillarInfo.label}
                </p>
              </div>

              {/* Marker list */}
              <div className="px-4 py-3 space-y-2">
                {markers.map((marker, i) => (
                  <div key={marker.id} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full ${style.dot} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                    >
                      {marker.id}
                    </span>
                    <span className="text-sm font-semibold text-[#28312f]">
                      {marker.name}
                    </span>
                    <span className="text-base ml-auto">{marker.icon}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 pb-6 pt-2 border-t border-[#e8e2d9]">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push("/learn/markers/flashcards")}
        >
          Start Flashcards →
        </Button>
      </div>
    </div>
  );
}
