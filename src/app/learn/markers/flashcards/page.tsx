"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { MARKERS } from "@/data/markers";
import type { Pillar } from "@/data/markers";

const PILLAR_COLORS: Record<Pillar, string> = {
  abiding: "#2e6e84",
  making: "#2e7d5e",
  enjoying: "#b07a2e",
};

export default function MarkersFlashcardsPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const marker = MARKERS[index];
  const progressPct = Math.round((index / MARKERS.length) * 100);

  const handleFlip = () => setFlipped((f) => !f);

  const handleNext = () => {
    if (index + 1 < MARKERS.length) {
      setFlipped(false);
      setTimeout(() => setIndex((i) => i + 1), 150);
    } else {
      setDone(true);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setFlipped(false);
      setTimeout(() => setIndex((i) => i - 1), 150);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col h-[100dvh] bg-white">
        <Header title="Marker Flashcards" showBack backHref="/learn/markers" showProfile={false} />
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center gap-6">
          <div className="text-6xl">🎴</div>
          <h2
            className="text-2xl font-bold text-[#28312f]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All 10 reviewed!
          </h2>
          <p className="text-[#6b6b6b] text-sm">
            Now let&apos;s test your recall with a partial-name match game.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button variant="primary" size="lg" fullWidth onClick={() => router.push("/learn/markers/match")}>
              Match Game →
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={() => { setIndex(0); setFlipped(false); setDone(false); }}>
              Review again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const color = PILLAR_COLORS[marker.pillar];

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header title="Marker Flashcards" showBack backHref="/learn/markers" showProfile={false} />

      {/* Progress */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1">
          <span>Card {index + 1} of {MARKERS.length}</span>
          <span>Tap to flip</span>
        </div>
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 pb-6">
        {/* Flashcard */}
        <div
          className="w-full max-w-sm cursor-pointer select-none"
          style={{ perspective: 1000 }}
          onClick={handleFlip}
        >
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div
                key="front"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: -90 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl shadow-lg overflow-hidden"
                style={{ backgroundColor: color }}
              >
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center min-h-[260px]">
                  <p className="text-white text-opacity-70 text-xs uppercase tracking-widest font-bold mb-3">
                    Marker #{marker.id}
                  </p>
                  <p
                    className="text-white text-4xl font-bold leading-none mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {marker.id}
                  </p>
                  <p className="text-white text-opacity-60 text-sm mt-4">
                    Tap to reveal the name
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: 90 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl shadow-lg overflow-hidden bg-white border-2"
                style={{ borderColor: color }}
              >
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center min-h-[260px]">
                  <span className="text-4xl mb-3">{marker.icon}</span>
                  <p
                    className="text-xl font-bold text-[#28312f] leading-snug mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {marker.name}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color }}>
                    {marker.pillar === "abiding"
                      ? "Abiding in Jesus"
                      : marker.pillar === "making"
                      ? "Making Disciples"
                      : "Enjoying Life Together"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 w-full max-w-sm mt-6">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrev}
            disabled={index === 0}
            className="flex-1"
          >
            ← Prev
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            className="flex-1"
          >
            {index + 1 < MARKERS.length ? "Next →" : "Done →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
