"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { VISION_STATEMENT } from "@/data/markers";

const WORDS = VISION_STATEMENT.replace(".", "").split(" ");

// Assign each word a highlight color for the animated reveal
const WORD_COLORS: Record<string, string> = {
  Abiding: "text-[#2e6e84]",
  Jesus: "text-[#2e6e84]",
  making: "text-[#2e7d5e]",
  disciples: "text-[#2e7d5e]",
  together: "text-[#b07a2e]",
};

export default function VisionLearnPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "words" | "full" | "ready">("intro");
  const [wordIndex, setWordIndex] = useState(0);

  const handleIntroNext = () => setPhase("words");

  const handleWordNext = () => {
    if (wordIndex + 1 < WORDS.length) {
      setWordIndex((i) => i + 1);
    } else {
      setPhase("full");
    }
  };

  const handleFullNext = () => setPhase("ready");

  const handleStart = () => router.push("/learn/vision/practice");

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header title="Phase 1: The Vision" showBack backHref="/dashboard" showProfile={false} />

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">

          {/* ── Intro ─────────────────────────────────────────────────────────── */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 max-w-sm"
            >
              <div className="w-20 h-20 rounded-full bg-[#f8f5f0] flex items-center justify-center text-4xl">
                🎯
              </div>
              <h2
                className="text-2xl font-bold text-[#28312f] leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Every disciple starts here.
              </h2>
              <p className="text-[#6b6b6b] text-base leading-relaxed">
                Watermark&apos;s entire vision for what it means to be a church — and a disciple — can be summed up in one sentence.
              </p>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">
                You&apos;ll learn it word by word, then practice until it sticks.
              </p>
              <Button variant="primary" size="lg" fullWidth onClick={handleIntroNext}>
                Let&apos;s learn it →
              </Button>
            </motion.div>
          )}

          {/* ── Word by Word ──────────────────────────────────────────────────── */}
          {phase === "words" && (
            <motion.div
              key={`word-${wordIndex}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-8 max-w-sm"
            >
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {WORDS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < wordIndex
                        ? "bg-[#ee7625]"
                        : i === wordIndex
                        ? "bg-[#28312f]"
                        : "bg-[#e8e2d9]"
                    }`}
                  />
                ))}
              </div>

              {/* Current word large */}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`text-5xl font-bold leading-none ${
                    WORD_COLORS[WORDS[wordIndex]] ?? "text-[#28312f]"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {WORDS[wordIndex]}
                </span>
              </div>

              {/* So-far sentence */}
              <p className="text-sm text-[#6b6b6b] leading-relaxed min-h-[3rem]">
                {WORDS.slice(0, wordIndex + 1).join(" ")}{wordIndex < WORDS.length - 1 ? "…" : "."}
              </p>

              <Button variant="primary" size="lg" fullWidth onClick={handleWordNext}>
                {wordIndex + 1 < WORDS.length ? "Next word →" : "See it all →"}
              </Button>
            </motion.div>
          )}

          {/* ── Full Statement ────────────────────────────────────────────────── */}
          {phase === "full" && (
            <motion.div
              key="full"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 max-w-sm"
            >
              <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold">
                Watermark&apos;s Vision
              </p>
              <blockquote
                className="text-3xl font-bold text-[#28312f] leading-snug text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {WORDS.map((word, i) => (
                  <span key={i}>
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className={WORD_COLORS[word] ?? ""}
                    >
                      {word}
                    </motion.span>
                    {i < WORDS.length - 1 ? " " : "."}
                  </span>
                ))}
              </blockquote>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">
                Three pillars, ten markers, one mission. Now let&apos;s make sure it sticks.
              </p>
              <Button variant="primary" size="lg" fullWidth onClick={handleFullNext}>
                I&apos;ve got it →
              </Button>
            </motion.div>
          )}

          {/* ── Ready to practice ─────────────────────────────────────────────── */}
          {phase === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 max-w-sm"
            >
              <div className="text-6xl">💪</div>
              <h2
                className="text-2xl font-bold text-[#28312f]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Time to practice!
              </h2>
              <p className="text-[#6b6b6b] text-base leading-relaxed">
                We&apos;ll fill in some blanks and unscramble the words to lock it in.
              </p>
              <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
                Start practice →
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
