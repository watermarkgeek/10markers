"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { PILLARS, MARKERS, getMarkersByPillar } from "@/data/markers";
import type { Pillar } from "@/data/markers";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import { Flame, Star, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { MarkerProgress } from "@/lib/db/schema";

const USER_ID_KEY = "10markers_user_id";

const pillarColors: Record<Pillar, { bg: string; text: string; ring: string; bar: "blue" | "green" | "amber" }> = {
  abiding:  { bg: "bg-[#e8f4f8]", text: "text-[#1d4d5e]", ring: "ring-[#a8d8ea]", bar: "blue"  },
  making:   { bg: "bg-[#e8f5f0]", text: "text-[#1d5240]", ring: "ring-[#a3d9c4]", bar: "green" },
  together: { bg: "bg-[#fdf3e3]", text: "text-[#7a5220]", ring: "ring-[#e8c98a]", bar: "amber" },
};

function isPillarUnlocked(pillar: Pillar, progress: MarkerProgress[]): boolean {
  if (pillar === "abiding") return true;
  if (pillar === "making") {
    // Abiding is complete when all abiding markers have quiz done
    const abidingMarkers = getMarkersByPillar("abiding");
    return abidingMarkers.every((m) =>
      progress.find((p) => p.markerId === m.id)?.quizCompleted
    );
  }
  if (pillar === "together") {
    const makingMarkers = getMarkersByPillar("making");
    return makingMarkers.every((m) =>
      progress.find((p) => p.markerId === m.id)?.quizCompleted
    );
  }
  return false;
}

function getNextMarkerHref(progress: MarkerProgress[]): string {
  // Find the first marker where quiz is not completed
  for (const marker of MARKERS) {
    const p = progress.find((pr) => pr.markerId === marker.id);
    if (!p?.quizCompleted) {
      if (!p?.introCompleted) return `/marker/${marker.id}/intro`;
      if (!p?.repeatCompleted) return `/marker/${marker.id}/repeat`;
      if (!p?.matchCompleted) return `/marker/${marker.id}/match`;
      if (!p?.fillblankCompleted) return `/marker/${marker.id}/fillblank`;
      return `/marker/${marker.id}/quiz`;
    }
  }
  return "/profile"; // all done
}

export default function DashboardPage() {
  const { user, progress, loading } = useUser();
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

  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const completedMarkers = progress.filter((p) => p.quizCompleted).length;
  const overallPct = Math.round((completedMarkers / MARKERS.length) * 100);
  const continueHref = getNextMarkerHref(progress);
  const allDone = completedMarkers === MARKERS.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showProfile title="The 10 Markers" showBack={false} />

      {/* Hero stats bar */}
      <div className="bg-[#1a2744] px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-4"
        >
          <div>
            <p className="text-blue-200 text-xs uppercase tracking-[0.15em] mb-0.5 overline" style={{ fontFamily: "var(--font-body)" }}>
              Welcome back
            </p>
            <h2 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{user?.name ?? "..."}</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[#c8973a]">
                <Flame size={16} />
                <span className="font-bold text-lg">{user?.streakDays ?? 0}</span>
              </div>
              <p className="text-blue-200 text-[10px] uppercase tracking-wide">
                Streak
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[#c8973a]">
                <Star size={16} />
                <span className="font-bold text-lg">{totalStars}</span>
              </div>
              <p className="text-blue-200 text-[10px] uppercase tracking-wide">
                Stars
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-white">
                {user?.totalXp ?? 0}
              </span>
              <p className="text-blue-200 text-[10px] uppercase tracking-wide">
                XP
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overall progress */}
        <div>
          <div className="flex justify-between text-xs text-blue-200 mb-1.5">
            <span>Overall progress</span>
            <span>{completedMarkers} / {MARKERS.length} markers</span>
          </div>
          <ProgressBar value={overallPct} color="amber" animated />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-4">
        {/* Continue button */}
        {!allDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href={continueHref}
              className="flex items-center justify-between w-full bg-[#ee7625] text-white rounded-2xl px-5 py-4 font-bold shadow-md hover:bg-[#cc6118] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="text-base tracking-wide">Continue Learning</span>
              <ChevronRight size={20} />
            </Link>
          </motion.div>
        )}

        {allDone && (
          <div className="bg-[#1a2744] text-white rounded-2xl px-5 py-4 text-center">
            <p className="text-lg font-bold mb-1">🎉 All 10 Markers Complete!</p>
            <p className="text-blue-200 text-sm">
              &ldquo;{`Abiding in Jesus, we are making disciples together.`}&rdquo;
            </p>
          </div>
        )}

        {/* Pillar cards */}
        <div className="flex flex-col gap-3">
          {(["abiding", "making", "together"] as Pillar[]).map((pillar, idx) => {
            const p = PILLARS[pillar];
            const markers = getMarkersByPillar(pillar);
            const completed = markers.filter(
              (m) => progress.find((pr) => pr.markerId === m.id)?.quizCompleted
            ).length;
            const pct = Math.round((completed / markers.length) * 100);
            const unlocked = isPillarUnlocked(pillar, progress);
            const colors = pillarColors[pillar];

            return (
              <motion.div
                key={pillar}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
              >
                <Link
                  href={unlocked ? `/pillar/${pillar}` : "#"}
                  className={`block rounded-2xl p-4 ring-1 transition-all ${colors.bg} ${colors.ring} ${
                    !unlocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-md active:scale-[0.99]"
                  }`}
                  onClick={(e) => { if (!unlocked) e.preventDefault(); }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${colors.text}`}>
                        {p.label}
                      </p>
                      <p className="text-xs text-[#6b6b6b]">
                        {completed} of {markers.length} markers complete
                      </p>
                    </div>
                    {unlocked ? (
                      <ChevronRight size={18} className={colors.text} />
                    ) : (
                      <Lock size={16} className="text-[#b0a898]" />
                    )}
                  </div>
                  <ProgressBar value={pct} color={colors.bar} height="sm" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
