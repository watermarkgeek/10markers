"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { PILLARS, MARKERS, VISION_STATEMENT } from "@/data/markers";
import type { Pillar } from "@/data/markers";

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; text: string; icon: string; accent: string }> = {
  abiding: { bg: "bg-[#eef6f9]", border: "border-[#2e6e84]", text: "text-[#2e6e84]", icon: "🌿", accent: "#2e6e84" },
  making: { bg: "bg-[#eef7f2]", border: "border-[#2e7d5e]", text: "text-[#2e7d5e]", icon: "🌍", accent: "#2e7d5e" },
  enjoying: { bg: "bg-[#fdf6ed]", border: "border-[#b07a2e]", text: "text-[#b07a2e]", icon: "🤝", accent: "#b07a2e" },
};

// Steps: intro, then one per pillar
type Step = "intro" | "abiding" | "making" | "enjoying";
const STEPS: Step[] = ["intro", "abiding", "making", "enjoying"];

export default function PillarsLearnPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const stepIdx = STEPS.indexOf(step);

  const handleNext = () => {
    const next = STEPS[stepIdx + 1];
    if (next) {
      setStep(next);
    } else {
      router.push("/learn/pillars/sort");
    }
  };

  const pillarLabel = (step !== "intro" ? step : null) as Pillar | null;
  const title = step === "intro" ? "Phase 3: The Pillars" : PILLARS[step as Pillar].label;

  return (
    <div className="flex flex-col h-full bg-white">
      <Header
        title={title}
        showBack={stepIdx === 0}
        backHref="/learn/markers/complete"
        showProfile={false}
      />

      {/* Step indicator */}
      <div className="flex gap-1.5 px-5 pt-3 pb-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= stepIdx ? "bg-[#ee7625]" : "bg-[#e8e2d9]"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ── Intro ──────────────────────────────────────────────────────── */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex-1 px-5 pt-4 pb-6 flex flex-col"
            >
              <div className="flex-1">
                <p
                  className="text-2xl font-bold text-[#28312f] mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  How the 10 Markers fit together
                </p>

                <p className="text-sm text-[#6b6b6b] leading-relaxed mb-5">
                  Watermark&apos;s vision for what it means to follow Jesus is captured in one sentence:
                </p>

                <div className="bg-[#f8f5f0] rounded-2xl px-5 py-5 mb-6">
                  <p
                    className="text-lg font-bold text-[#28312f] text-center italic leading-relaxed"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    &ldquo;{VISION_STATEMENT}&rdquo;
                  </p>
                </div>

                <p className="text-sm text-[#6b6b6b] leading-relaxed mb-5">
                  Each of the 10 markers you learned fits under one of three pillars from this statement:
                </p>

                {/* Three pillar preview cards */}
                <div className="space-y-2.5">
                  {PILLARS_ORDER.map((pillar) => {
                    const style = PILLAR_STYLES[pillar];
                    const count = MARKERS.filter((m) => m.pillar === pillar).length;
                    return (
                      <div
                        key={pillar}
                        className={`flex items-center gap-3 rounded-xl ${style.bg} border-l-4 ${style.border} px-4 py-3`}
                      >
                        <span className="text-2xl">{style.icon}</span>
                        <div>
                          <p className={`text-sm font-bold ${style.text}`}>
                            {PILLARS[pillar].label}
                          </p>
                          <p className="text-xs text-[#6b6b6b]">{count} markers</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Individual Pillar Pages ────────────────────────────────────── */}
          {pillarLabel && (
            <motion.div
              key={pillarLabel}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex-1 px-5 pt-4 pb-6 flex flex-col"
            >
              {(() => {
                const info = PILLARS[pillarLabel];
                const style = PILLAR_STYLES[pillarLabel];
                const markers = MARKERS.filter((m) => m.pillar === pillarLabel);

                return (
                  <div className="flex-1">
                    {/* Pillar icon + name */}
                    <div className="text-center mb-5">
                      <span className="text-5xl">{style.icon}</span>
                      <p
                        className="text-2xl font-bold mt-2"
                        style={{ fontFamily: "var(--font-heading)", color: style.accent }}
                      >
                        {info.label}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-base text-[#28312f] leading-relaxed mb-5">
                      {info.description}
                    </p>

                    {/* Scripture */}
                    <div className="bg-[#f8f5f0] rounded-2xl px-5 py-4 mb-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                        Key Scripture
                      </p>
                      <p className="text-sm text-[#28312f] italic leading-relaxed">
                        &ldquo;{info.scripture.text.length > 180
                          ? info.scripture.text.slice(0, 180) + "…"
                          : info.scripture.text}&rdquo;
                      </p>
                      <p className="text-sm font-bold mt-2" style={{ color: style.accent }}>
                        — {info.scripture.reference}
                      </p>
                    </div>

                    {/* Markers in this pillar */}
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-3">
                      {markers.length} Markers in this pillar
                    </p>
                    <div className="space-y-2">
                      {markers.map((marker) => (
                        <div
                          key={marker.id}
                          className={`flex items-center gap-3 rounded-xl ${style.bg} px-4 py-3`}
                        >
                          <span className="text-xl">{marker.icon}</span>
                          <p className="text-sm font-semibold text-[#28312f]">{marker.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="shrink-0 px-5 pb-4 pt-2 border-t border-[#e8e2d9] flex gap-3">
        {stepIdx > 0 && (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setStep(STEPS[stepIdx - 1])}
            className="flex-1"
          >
            ← Back
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth={stepIdx === 0}
          onClick={handleNext}
          className={stepIdx > 0 ? "flex-1" : ""}
        >
          {stepIdx < STEPS.length - 1 ? "Next →" : "Sort Activity →"}
        </Button>
      </div>
    </div>
  );
}
