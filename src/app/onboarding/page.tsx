"use client";

import { useState } from "react";
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
    <div className="flex flex-col min-h-screen bg-[#1a2744] text-white overflow-hidden">
      {/* Top logo / branding */}
      <div className="flex-none px-6 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c8973a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Watermark Community Church
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            The 10 Markers
          </h1>
          <p className="text-sm text-blue-200 italic leading-relaxed max-w-xs mx-auto">
            &ldquo;{VISION_STATEMENT}&rdquo;
          </p>
        </motion.div>
      </div>

      {/* Content card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10 flex flex-col">
        {step === "welcome" ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col flex-1"
          >
            <h2 className="text-xl font-bold text-[#1a2744] mb-3">
              Learn what it means to follow Jesus.
            </h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">
              The 10 Markers are what Watermark believes makes up someone who
              is a disciple of Jesus. This app will walk you through each one
              through games, flashcards, and quizzes — at your own pace.
            </p>

            {/* Pillar preview */}
            <div className="flex flex-col gap-3 mb-8">
              {(["abiding", "making", "together"] as const).map((pillar) => {
                const p = PILLARS[pillar];
                const colors = {
                  abiding: "bg-blue-50 border-blue-200 text-blue-700",
                  making: "bg-emerald-50 border-emerald-200 text-emerald-700",
                  together: "bg-amber-50 border-amber-200 text-amber-700",
                };
                return (
                  <div
                    key={pillar}
                    className={`rounded-xl border px-4 py-3 ${colors[pillar]}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5">
                      {p.label}
                    </p>
                    <p className="text-xs opacity-80 leading-snug">
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
            className="flex flex-col flex-1"
          >
            <h2 className="text-xl font-bold text-[#1a2744] mb-2">
              What&apos;s your name?
            </h2>
            <p className="text-[#6b6b6b] text-sm mb-8">
              We&apos;ll use this to personalize your experience.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                autoFocus
                maxLength={40}
                className="w-full border-2 border-[#e8e2d9] rounded-xl px-4 py-3 text-lg text-[#1a2744] placeholder-[#b0a898] focus:outline-none focus:border-[#1a2744] transition-colors"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <div className="mt-auto pt-6">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting || !name.trim()}
                >
                  {isSubmitting ? "Starting..." : "Let's Go →"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("welcome")}
                  className="w-full mt-3 text-sm text-[#6b6b6b] hover:text-[#1a2744] transition-colors py-2"
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
