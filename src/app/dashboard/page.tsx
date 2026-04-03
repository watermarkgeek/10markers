"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import { Flame, Star, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";

const USER_ID_KEY = "10markers_user_id";

interface PhaseCard {
  phase: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  xpReward: number;
}

const PHASE_CARDS: PhaseCard[] = [
  {
    phase: 1,
    title: "The Vision",
    subtitle: "Learn Watermark's one-sentence mission.",
    icon: "🎯",
    href: "/learn/vision",
    xpReward: 50,
  },
  {
    phase: 2,
    title: "The 10 Markers",
    subtitle: "Learn the name of every marker.",
    icon: "🎴",
    href: "/learn/markers",
    xpReward: 75,
  },
  {
    phase: 3,
    title: "The 3 Pillars",
    subtitle: "Sort every marker into its pillar.",
    icon: "🏛️",
    href: "/learn/pillars",
    xpReward: 100,
  },
  {
    phase: 4,
    title: "Deep Dive",
    subtitle: "Definitions, scripture, and quizzes for each marker.",
    icon: "📖",
    href: "/dashboard",
    xpReward: 0,
  },
];

export default function DashboardPage() {
  const { user, phases, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) router.replace("/onboarding");
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const phaseCompleted = [
    phases.visionCompleted,
    phases.markersCompleted,
    phases.pillarsCompleted,
    false, // Phase 4 coming soon
  ];

  // First incomplete phase (0-indexed) — used to unlock next
  const nextPhaseIdx = phaseCompleted.findIndex((c) => !c);
  // 0 = phase 1, 1 = phase 2, etc.

  const phasesComplete = phaseCompleted.filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showProfile showBack={false} />

      {/* Hero stats bar */}
      <div className="bg-[#1a2744] px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-blue-200 text-xs uppercase tracking-[0.15em] mb-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Welcome back
              </p>
              <h2
                className="text-white text-xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {user?.name ?? "…"}
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[#c8973a]">
                  <Flame size={16} />
                  <span className="font-bold text-lg">{user?.streakDays ?? 0}</span>
                </div>
                <p className="text-blue-200 text-[10px] uppercase tracking-wide">Streak</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[#c8973a]">
                  <Star size={16} />
                  <span className="font-bold text-lg">
                    {(phases.visionStars + phases.markersStars + phases.pillarsStars)}
                  </span>
                </div>
                <p className="text-blue-200 text-[10px] uppercase tracking-wide">Stars</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-white">{user?.totalXp ?? 0}</span>
                <p className="text-blue-200 text-[10px] uppercase tracking-wide">XP</p>
              </div>
            </div>
          </div>

          {/* Vision statement */}
          <div className="bg-white bg-opacity-10 rounded-xl px-4 py-3">
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Vision</p>
            <p
              className="text-white text-sm font-semibold leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Abiding in Jesus, we are making disciples together.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Phase cards */}
      <div className="flex-1 px-4 py-5 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-[#6b6b6b] font-bold px-1">
          Your Learning Path — {phasesComplete} of 3 foundations complete
        </p>

        {PHASE_CARDS.map((card, idx) => {
          const completed = phaseCompleted[idx];
          const isNext = idx === nextPhaseIdx;
          const isLocked = idx > nextPhaseIdx && nextPhaseIdx !== -1;
          const isFuture = card.phase === 4;

          return (
            <motion.div
              key={card.phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 + 0.1 }}
            >
              <button
                disabled={isLocked || isFuture}
                onClick={() => {
                  if (!isLocked && !isFuture) router.push(card.href);
                }}
                className={`w-full rounded-2xl p-4 text-left transition-all ${
                  completed
                    ? "bg-[#f0faf4] border-2 border-green-300"
                    : isNext
                    ? "bg-[#ee7625] text-white shadow-md hover:bg-[#cc6118] active:scale-[0.99]"
                    : isFuture
                    ? "bg-[#f8f5f0] border-2 border-dashed border-[#e8e2d9] opacity-60 cursor-not-allowed"
                    : "bg-[#f8f5f0] border-2 border-[#e8e2d9] opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      completed
                        ? "bg-green-100"
                        : isNext
                        ? "bg-white bg-opacity-20"
                        : "bg-white"
                    }`}
                  >
                    {completed ? "✅" : card.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isNext ? "text-orange-100" : completed ? "text-green-600" : "text-[#6b6b6b]"
                        }`}
                      >
                        Phase {card.phase}
                        {isFuture && " — Coming Soon"}
                      </span>
                      {completed && <CheckCircle2 size={13} className="text-green-600" />}
                    </div>
                    <p
                      className={`font-bold text-base leading-tight ${
                        isNext ? "text-white" : "text-[#1a2744]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {card.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isNext ? "text-orange-100" : "text-[#6b6b6b]"
                      }`}
                    >
                      {card.subtitle}
                    </p>
                    {!isFuture && card.xpReward > 0 && !completed && (
                      <p className={`text-xs font-semibold mt-1 ${isNext ? "text-orange-100" : "text-[#c8973a]"}`}>
                        +{card.xpReward} XP
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isFuture || (isLocked && !completed) ? (
                      <Lock size={18} className="text-[#b0a898]" />
                    ) : completed ? (
                      <ChevronRight size={18} className="text-green-500" />
                    ) : (
                      <ChevronRight size={18} className={isNext ? "text-white" : "text-[#1a2744]"} />
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* All foundations done callout */}
        {phasesComplete >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a2744] text-white rounded-2xl px-5 py-4 text-center mt-1"
          >
            <p className="text-lg font-bold mb-1">🎉 All 3 foundations complete!</p>
            <p className="text-blue-200 text-sm">
              Deep-dive content for each marker is coming soon.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
