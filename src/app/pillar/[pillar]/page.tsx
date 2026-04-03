"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import {
  PILLARS,
  getMarkersByPillar,
  MARKERS,
} from "@/data/markers";
import type { Pillar } from "@/data/markers";
import { STAGES } from "@/types";
import type { Stage } from "@/types";
import Header from "@/components/layout/Header";
import StarRating from "@/components/ui/StarRating";
import ProgressBar from "@/components/ui/ProgressBar";
import { Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { MarkerProgress } from "@/lib/db/schema";

const USER_ID_KEY = "10markers_user_id";

const pillarColors: Record<Pillar, { bar: "blue" | "green" | "amber"; accent: string }> = {
  abiding: { bar: "blue", accent: "text-blue-700" },
  making: { bar: "green", accent: "text-emerald-700" },
  enjoying: { bar: "amber", accent: "text-amber-700" },
};

function getStagesCompleted(p: MarkerProgress): Stage[] {
  const done: Stage[] = [];
  if (p.introCompleted) done.push("intro");
  if (p.repeatCompleted) done.push("repeat");
  if (p.matchCompleted) done.push("match");
  if (p.fillblankCompleted) done.push("fillblank");
  if (p.quizCompleted) done.push("quiz");
  return done;
}

function getMarkerNextHref(markerId: number, p: MarkerProgress): string {
  if (!p.introCompleted) return `/marker/${markerId}/intro`;
  if (!p.repeatCompleted) return `/marker/${markerId}/repeat`;
  if (!p.matchCompleted) return `/marker/${markerId}/match`;
  if (!p.fillblankCompleted) return `/marker/${markerId}/fillblank`;
  if (!p.quizCompleted) return `/marker/${markerId}/quiz`;
  return `/marker/${markerId}/intro`; // all done — revisit
}

function isMarkerUnlocked(markerId: number, progress: MarkerProgress[]): boolean {
  const marker = MARKERS.find((m) => m.id === markerId);
  if (!marker) return false;

  // First marker in a pillar is always unlocked if pillar is open
  const pillarMarkers = getMarkersByPillar(marker.pillar);
  const index = pillarMarkers.findIndex((m) => m.id === markerId);
  if (index === 0) return true;

  // Otherwise the previous marker must have quiz completed
  const prev = pillarMarkers[index - 1];
  return progress.find((p) => p.markerId === prev.id)?.quizCompleted ?? false;
}

export default function PillarPage() {
  const params = useParams();
  const router = useRouter();
  const pillar = params.pillar as Pillar;
  const { progress, loading } = useUser();

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) router.replace("/onboarding");
    if (pillar && !PILLARS[pillar]) router.replace("/dashboard");
  }, [router, pillar]);

  if (loading || !PILLARS[pillar]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pillarData = PILLARS[pillar];
  const markers = getMarkersByPillar(pillar);
  const colors = pillarColors[pillar];
  const completedCount = markers.filter(
    (m) => progress.find((p) => p.markerId === m.id)?.quizCompleted
  ).length;
  const pct = Math.round((completedCount / markers.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack backHref="/dashboard" title={pillarData.label} />

      {/* Pillar header */}
      <div className="px-5 pt-5 pb-6 border-b border-[#e8e2d9]">
        <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4">
          {pillarData.description}
        </p>
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1.5">
          <span>Progress</span>
          <span>{completedCount} / {markers.length} complete</span>
        </div>
        <ProgressBar value={pct} color={colors.bar} />
      </div>

      {/* Marker list */}
      <div className="flex-1 px-4 py-5 flex flex-col gap-3">
        {markers.map((marker, idx) => {
          const p = progress.find((pr) => pr.markerId === marker.id);
          const stagesCompleted = p ? getStagesCompleted(p) : [];
          const isComplete = p?.quizCompleted ?? false;
          const unlocked = isMarkerUnlocked(marker.id, progress);
          const nextHref = p ? getMarkerNextHref(marker.id, p) : `/marker/${marker.id}/intro`;

          return (
            <motion.div
              key={marker.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Link
                href={unlocked ? nextHref : "#"}
                onClick={(e) => { if (!unlocked) e.preventDefault(); }}
                className={`block rounded-2xl border p-4 transition-all ${
                  unlocked
                    ? "border-[#e8e2d9] hover:border-[#1a2744] hover:shadow-sm active:scale-[0.99]"
                    : "border-[#e8e2d9] opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{marker.icon}</span>
                    <div>
                      <p className="font-bold text-[#1a2744] text-sm">
                        {marker.id}. {marker.name}
                      </p>
                      <StarRating stars={p?.stars ?? 0} size="sm" className="mt-0.5" />
                    </div>
                  </div>
                  {!unlocked ? (
                    <Lock size={16} className="text-[#b0a898] mt-1" />
                  ) : isComplete ? (
                    <CheckCircle2 size={18} className="text-[#2e7d5e] mt-1" />
                  ) : (
                    <ChevronRight size={18} className="text-[#6b6b6b] mt-1" />
                  )}
                </div>

                {/* Stage dots */}
                <div className="flex gap-1.5 mt-2">
                  {STAGES.map((stage) => (
                    <div
                      key={stage}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        stagesCompleted.includes(stage)
                          ? "bg-[#1a2744]"
                          : "bg-[#e8e2d9]"
                      }`}
                    />
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
