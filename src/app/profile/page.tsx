"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StarRating from "@/components/ui/StarRating";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { MARKERS, PILLARS, getMarkersByPillar } from "@/data/markers";
import type { Pillar } from "@/data/markers";
import { motion } from "framer-motion";
import { Flame, Star, Zap, Trophy } from "lucide-react";

const USER_ID_KEY = "10markers_user_id";

const pillarColors: Record<Pillar, { bar: "blue" | "green" | "amber"; accent: string; bg: string }> = {
  abiding: { bar: "blue", accent: "text-blue-700", bg: "bg-blue-50" },
  making: { bar: "green", accent: "text-emerald-700", bg: "bg-emerald-50" },
  enjoying: { bar: "amber", accent: "text-amber-700", bg: "bg-amber-50" },
};

export default function ProfilePage() {
  const { user, progress, badges, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) router.replace("/onboarding");
  }, [router]);

  const handleReset = () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      localStorage.removeItem(USER_ID_KEY);
      router.replace("/onboarding");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const completedMarkers = progress.filter((p) => p.quizCompleted).length;
  const markerBadges = badges.filter((b) => b.type === "marker_complete");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack backHref="/dashboard" title="My Progress" showProfile={false} />

      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a2744] rounded-2xl p-5"
        >
          <p className="text-white font-bold text-lg mb-4">{user?.name}</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <Flame size={18} className="text-[#c8973a]" />, value: user?.streakDays ?? 0, label: "Streak" },
              { icon: <Star size={18} className="text-[#c8973a]" />, value: totalStars, label: "Stars" },
              { icon: <Zap size={18} className="text-[#c8973a]" />, value: user?.totalXp ?? 0, label: "XP" },
              { icon: <Trophy size={18} className="text-[#c8973a]" />, value: completedMarkers, label: "Done" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                {stat.icon}
                <span className="text-white font-bold text-lg">{stat.value}</span>
                <span className="text-blue-200 text-[9px] uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pillar progress */}
        {(["abiding", "making", "enjoying"] as Pillar[]).map((pillar, idx) => {
          const markers = getMarkersByPillar(pillar);
          const done = markers.filter((m) => progress.find((p) => p.markerId === m.id)?.quizCompleted).length;
          const pct = Math.round((done / markers.length) * 100);
          const colors = pillarColors[pillar];

          return (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx }}
            >
              <div className={`rounded-2xl ${colors.bg} p-4`}>
                <div className="flex justify-between items-center mb-3">
                  <p className={`text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
                    {PILLARS[pillar].label}
                  </p>
                  <span className="text-xs text-[#6b6b6b]">{done}/{markers.length}</span>
                </div>
                <ProgressBar value={pct} color={colors.bar} height="sm" className="mb-3" />
                <div className="flex flex-col gap-1.5">
                  {markers.map((marker) => {
                    const mp = progress.find((p) => p.markerId === marker.id);
                    return (
                      <div key={marker.id} className="flex items-center justify-between">
                        <span className="text-xs text-[#1a2744] flex items-center gap-1.5">
                          <span>{marker.icon}</span>
                          <span>{marker.name}</span>
                        </span>
                        <StarRating stars={mp?.stars ?? 0} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Badges */}
        {markerBadges.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 className="text-sm font-bold text-[#1a2744] uppercase tracking-wider mb-3">
              Badges Earned
            </h3>
            <div className="flex flex-wrap gap-3">
              {markerBadges.map((badge) => {
                const marker = MARKERS.find((m) => m.id === badge.markerId);
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 w-16"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#f8f5f0] border-2 border-[#c8973a] flex items-center justify-center text-2xl">
                      {marker?.icon ?? "🏅"}
                    </div>
                    <p className="text-[9px] text-center text-[#6b6b6b] leading-tight">
                      {marker?.name ?? "Badge"}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Reset */}
        <div className="pt-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-400 hover:text-red-600">
            Reset All Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
