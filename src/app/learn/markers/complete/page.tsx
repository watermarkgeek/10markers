"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import XpPopup from "@/components/celebration/XpPopup";
import Confetti from "@/components/celebration/Confetti";
import { useUser } from "@/hooks/useUser";
import { MARKERS } from "@/data/markers";

export default function MarkersCompletePage() {
  const router = useRouter();
  const { completePhase } = useUser();
  const [xpAmount, setXpAmount] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    completePhase("markers", 3)
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
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header title="Phase 2 Complete!" showProfile={false} />
      <XpPopup xp={xpAmount} show={showXp} />
      {done && <Confetti trigger intensity="full" />}

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-5 max-w-sm"
        >
          <div className="text-7xl">🎴</div>

          <h2
            className="text-2xl font-bold text-[#28312f]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You know all 10 markers!
          </h2>

          {/* Quick recap */}
          <div className="bg-[#f8f5f0] rounded-2xl px-4 py-4 w-full text-left space-y-1.5">
            {MARKERS.map((m) => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                <span className="text-base">{m.icon}</span>
                <span className="font-semibold text-[#28312f]">{m.name}</span>
              </div>
            ))}
          </div>

          <p className="text-[#6b6b6b] text-sm leading-relaxed">
            Next: learn how each marker fits under its pillar.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push("/learn/pillars")}
            >
              Phase 3: The Pillars →
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
