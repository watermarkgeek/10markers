"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import XpPopup from "@/components/celebration/XpPopup";
import Confetti from "@/components/celebration/Confetti";
import { useUser } from "@/hooks/useUser";
import { MARKERS, PILLARS } from "@/data/markers";
import type { Pillar } from "@/data/markers";

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; text: string }> = {
  abiding: { bg: "bg-[#eef6f9]", border: "border-[#2e6e84]", text: "text-[#2e6e84]" },
  making: { bg: "bg-[#eef7f2]", border: "border-[#2e7d5e]", text: "text-[#2e7d5e]" },
  enjoying: { bg: "bg-[#fdf6ed]", border: "border-[#b07a2e]", text: "text-[#b07a2e]" },
};

export default function PillarsCompletePage() {
  const router = useRouter();
  const { completePhase } = useUser();
  const [xpAmount, setXpAmount] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    completePhase("pillars", 3)
      .then(({ xpGain }) => {
        if (cancelled) return;
        if (xpGain > 0) {
          setXpAmount(xpGain);
          setShowXp(true);
        }
        setDone(true);
      })
      .catch(console.error);
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Phase 3 Complete!" showProfile={false} />
      <XpPopup xp={xpAmount} show={showXp} />
      {done && <Confetti trigger intensity="full" />}

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-5 max-w-sm mx-auto text-center"
        >
          <div className="text-7xl">🏆</div>

          <h2
            className="text-2xl font-bold text-[#28312f]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You know the full picture!
          </h2>

          <p className="text-[#6b6b6b] text-sm leading-relaxed">
            Here&apos;s the complete chart of all 10 markers organized under their pillars.
          </p>

          {/* Full chart */}
          <div className="w-full space-y-3">
            {PILLARS_ORDER.map((pillar) => {
              const info = PILLARS[pillar];
              const style = PILLAR_STYLES[pillar];
              const markers = MARKERS.filter((m) => m.pillar === pillar);
              return (
                <div key={pillar} className={`rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden`}>
                  <div className="px-4 py-2 border-b border-current border-opacity-20">
                    <p className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                      {info.label}
                    </p>
                  </div>
                  <div className="px-4 py-2 space-y-1.5">
                    {markers.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-sm">
                        <span>{m.icon}</span>
                        <span className="font-medium text-[#28312f]">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
