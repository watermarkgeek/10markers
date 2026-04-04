"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Button from "@/components/ui/Button";
import { VISION_STATEMENT, PILLARS } from "@/data/markers";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"welcome" | "name">("welcome");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { createUser } = useUser();
  const router = useRouter();

  const handleBegin = () => setStep("name");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await createUser(name.trim());
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#28312f] text-white overflow-hidden">
      {/* ── Hero / Branding ──────────────────────────────────────────────── */}
      <div className="flex-none px-6 pt-10 pb-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Watermark W logo — white pill so it pops off dark background */}
          <div className="bg-white rounded-2xl p-2.5 shadow-lg">
            <Image
              src="/wm-logo.png"
              alt="Watermark Community Church"
              width={44}
              height={44}
              className="block"
            />
          </div>

          {/* Overline */}
          <p
            className="text-[#ee7625] text-xs font-bold uppercase tracking-[0.22em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Watermark Community Church
          </p>

          {/* App title — "The" small, "10 Markers" large together */}
          <h1
            className="font-bold text-white leading-tight text-center"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.03em" }}
          >
            <span className="block text-base uppercase tracking-[0.2em] text-white/70 mb-0.5">The</span>
            <span className="block text-4xl leading-none text-[#ee7625]">
              10 Markers
            </span>
          </h1>

          {/* Vision statement — serif italic */}
          <p
            className="text-xs text-white/70 leading-relaxed max-w-xs italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;{VISION_STATEMENT}&rdquo;
          </p>
        </motion.div>
      </div>

      {/* ── Content card ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 bg-white rounded-t-3xl px-6 pt-6 pb-6 flex flex-col overflow-y-auto">
        {step === "welcome" ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <h2
              className="text-xl font-bold text-[#28312f] mb-1.5 leading-snug"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.01em" }}
            >
              Learn what it means to follow Jesus.
            </h2>
            <p
              className="text-[#6b6b6b] text-sm leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The 10 Markers are what Watermark believes makes up someone who
              is a disciple of Jesus. This app will walk you through each one
              through games, flashcards, and quizzes — at your own pace.
            </p>

            {/* Three-pillar preview */}
            <div className="flex flex-col gap-2 mb-5">
              {(["abiding", "making", "enjoying"] as const).map((pillar) => {
                const p = PILLARS[pillar];
                const colors = {
                  abiding:  { bg: "bg-[#eef6f9]", border: "border-[#2e6e84]", text: "text-[#1d4d5e]" },
                  making:   { bg: "bg-[#eef7f2]", border: "border-[#2e7d5e]", text: "text-[#1d5240]" },
                  enjoying: { bg: "bg-[#fdf6ed]", border: "border-[#b07a2e]", text: "text-[#7a5220]" },
                };
                const c = colors[pillar];
                return (
                  <div
                    key={pillar}
                    className={`rounded-xl border-l-4 ${c.border} ${c.bg} px-4 py-2.5`}
                  >
                    <p
                      className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${c.text}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {p.label}
                    </p>
                    <p
                      className="text-xs text-[#6b6b6b] leading-snug"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto">
              <Button variant="primary" size="lg" fullWidth onClick={handleBegin}>
                Begin the Journey
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <h2
              className="text-2xl font-bold text-[#28312f] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What&apos;s your name?
            </h2>
            <p
              className="text-[#6b6b6b] text-sm mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We&apos;ll use this to personalize your experience.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                autoFocus
                maxLength={40}
                className="w-full border-2 border-[#e8e2d9] rounded-xl px-4 py-3 text-lg text-[#28312f] placeholder-[#b0a898] focus:outline-none focus:border-[#28312f] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <div className="mt-auto pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting || !name.trim()}
                >
                  {isSubmitting ? "Starting…" : "Let's Go →"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("welcome")}
                  className="w-full mt-3 text-sm text-[#6b6b6b] hover:text-[#28312f] transition-colors py-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  ← Back
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
