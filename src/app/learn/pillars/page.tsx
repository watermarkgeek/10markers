"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { PILLARS, MARKERS } from "@/data/markers";
import type { Pillar } from "@/data/markers";

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; text: string; icon: string }> = {
  abiding: { bg: "bg-[#eef6f9]", border: "border-[#2e6e84]", text: "text-[#2e6e84]", icon: "🌿" },
  making: { bg: "bg-[#eef7f2]", border: "border-[#2e7d5e]", text: "text-[#2e7d5e]", icon: "🌍" },
  enjoying: { bg: "bg-[#fdf6ed]", border: "border-[#b07a2e]", text: "text-[#b07a2e]", icon: "🤝" },
};

export default function PillarsLearnPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="Phase 3: The Pillars" showBack backHref="/learn/markers/complete" showProfile={false} />

      <div className="px-5 pt-5 pb-4">
        <p
          className="text-2xl font-bold text-[#28312f] mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Three Pillars
        </p>
        <p className="text-sm text-[#6b6b6b]">
          The 10 markers are organized under 3 pillars from our vision statement. Learn how each marker groups, then sort them yourself.
        </p>
      </div>

      <div className="flex-1 px-5 pb-6 space-y-5 overflow-y-auto">
        {PILLARS_ORDER.map((pillar, idx) => {
          const info = PILLARS[pillar];
          const style = PILLAR_STYLES[pillar];
          const markers = MARKERS.filter((m) => m.pillar === pillar);

          return (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className={`rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden`}
            >
              {/* Pillar header */}
              <div className="px-4 py-4 border-b border-current border-opacity-20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{style.icon}</span>
                  <p
                    className={`text-lg font-bold ${style.text}`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {info.label}
                  </p>
                </div>
                <p className="text-xs text-[#6b6b6b] leading-relaxed">{info.description}</p>
              </div>

              {/* Scripture */}
              <div className="px-4 py-3 bg-white bg-opacity-50 border-b border-current border-opacity-10">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6b6b6b] mb-1">
                  Key Scripture
                </p>
                <p className="text-xs text-[#28312f] italic">
                  &ldquo;{info.scripture.text.slice(0, 100)}…&rdquo;
                </p>
                <p className={`text-xs font-bold mt-1 ${style.text}`}>— {info.scripture.reference}</p>
              </div>

              {/* Markers */}
              <div className="px-4 py-3 space-y-2">
                {markers.map((marker) => (
                  <div key={marker.id} className="flex items-center gap-2">
                    <span className="text-base">{marker.icon}</span>
                    <span className="text-sm font-medium text-[#28312f]">{marker.name}</span>
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
          onClick={() => router.push("/learn/pillars/sort")}
        >
          Sort Activity →
        </Button>
      </div>
    </div>
  );
}
